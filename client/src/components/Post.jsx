import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Comment } from './Comment';
import { Link } from 'react-router-dom';
import { usernameState, isLoggedInState } from '../atoms';
import { useRecoilState } from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid, faUser, faBookmark as faBookmarkSolid, faEllipsis, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faBookmark as faBookmarkRegular, faClipboard } from '@fortawesome/free-regular-svg-icons'
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { handleClipboard } from '../helpers/Clipboard';
import '../index.css'

export function Post() {
    const { postID } = useParams();
    const [post, setPost] = useState({});
    const [username, setUsername] = useState('');
    const [avatarURL, setAvatarURL] = useState('');
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [likeCount, setlikeCount] = useState(0);
    const [timeAgo, setTimeAgo] = useState('');
    const [newComment, setNewComment] = useState('');
    const [globalUsername, setGlobalUsername] = useRecoilState(usernameState);
    const navigate = useNavigate();

    //fetching post with it's id
    useEffect(() => {
        async function getPost() {
            try {
                const response = await axios.get(`http://localhost:3000/post/${postID}`);
                const data = response.data;
                console.log(data);

                setPost(data.post);
                setUsername(data.post.username);
                setlikeCount(data.post.likeCount);
            }
            catch (e) {
                toast.error('Error fetching post', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                console.log('Error fetching post : ' + e);
            }
        }

        async function getLikeInclude() {
            try {
                const response = await axios.get(`http://localhost:3000/post/${postID}/checkLiked`,
                    { withCredentials: true },
                )
                const data = response.data;

                if (data.status === 'success')
                    setLiked(JSON.parse(data.message));
                else
                    console.log('Error : ' + data.message);
            }
            catch (e) {
                console.log('Error : ' + e);
            }
        }

        async function getSaved() {
            try {
                const response = await axios.get(`http://localhost:3000/user/checkSaved/${postID}`,
                    { withCredentials: true },
                )
                const data = response.data;

                if (data.status === 'success')
                    setSaved(JSON.parse(data.message));
                else
                    console.log('Error : ' + data.message);
            }
            catch (e) {
                console.log('Error : ' + e);
            }
        }

        getPost();
        getLikeInclude();
        getSaved();
    }, [postID]);

    useEffect(() => {
        if (post?.createdAt) {
            const date = parseISO(post.createdAt);
            const formattedTime = formatDistanceToNow(date, { addSuffix: true });
            setTimeAgo(formattedTime);
        }

        async function fetchUser() {
            try {
                if (username === '') return;

                const response = await axios.get(`http://localhost:3000/user/${username}`,
                    { withCredentials: true },
                )
                const data = response.data;

                if (data.status === 'success') {
                    setAvatarURL(data.userData.avatarString);
                }
                else {
                    console.log('Error : ' + data.message);
                    setAvatarURL('');
                }
            }
            catch (e) {
                console.log('Error : ' + e);
            }
        }

        fetchUser();
    }, [post]);

    async function handleLike() {
        try {
            const response = await axios.get(`http://localhost:3000/post/like/${postID}`,
                { withCredentials: true },
            )
            const data = response.data;

            if (data.status === 'success') {
                toast.success('Liked Post', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                console.log('Liked post');
                setlikeCount(data.newLikeCount);
                setLiked(true);
            }
            else {
                if (data.message === 'no token found') {
                    toast.error('Login to like post', {
                        position: "bottom-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        transition: Bounce,
                    });
                }
                else {
                    toast.error('Error liking post', {
                        position: "bottom-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        transition: Bounce,
                    });
                    console.log('ERROR : ' + data.message);
                }
            }
        }
        catch (e) {
            toast.error('Error liking post', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            console.log('Error during "like" operation : ' + e);
        }
    }

    async function handleDislike() {
        try {
            const response = await axios.get(`http://localhost:3000/post/disLike/${postID}`,
                { withCredentials: true },
            )
            const data = response.data;

            if (data.status === 'success') {
                toast.success('Disliked post', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                console.log('disliked post');
                setlikeCount(data.newLikeCount);
                setLiked(false);
            }
            else {
                toast.error('Error disliking post', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                console.log('ERROR : ' + data.message);
            }
        }
        catch (e) {
            toast.error('Error disliking post', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            console.log('Error during "dislike" operation : ' + e);
        }
    }

    async function handleDelete() {
        try {
            const response = await axios.get(`http://localhost:3000/post/deletePost/${postID}`,
                { withCredentials: true },
            )
            const data = response.data;
            console.log(data);

            if (data.status === 'success') {
                toast.success('Deleted post', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                console.log('deleted post');
                navigate('/');
            }
            else {
                toast.error('Error deleting post', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                console.log('ERROR : ' + data.message);
            }
        }
        catch (e) {
            toast.error('Error deleting post', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            console.log('Error during "delete" operation : ' + e);
        }
    }


    async function handleSubmit() {
        try {
            const response = await axios.post(`http://localhost:3000/post/${postID}/newComment`,
                { newComment },
                { withCredentials: true },
            )
            const data = response.data;

            if (data.status === 'success') {
                console.log('comment added');
            }
            else {
                toast.error('Error posting comment', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                console.log('comment added');
            }

            // navigate(`/post/${postID}`);
            window.location.reload();
        }
        catch (e) {
            toast.error('Error posting comment', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            console.log('Error during "newComment" : ' + e);
        }
    }

    async function handleSavePost() {
        try {
            const response = await axios.get(`http://localhost:3000/user/savePost/${postID}`,
                { withCredentials: true },
            )
            const data = response.data;

            if (data.status === 'success') {
                toast.success('Added to saved posts', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                setSaved(true);
                console.log('Saved Post');
            }
            else {
                toast.error('Error adding to saved posts', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                console.log('Error : ' + data.message);
            }
        }
        catch (e) {
            toast.error('Error adding to saved posts', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            console.log('Error saving post : ' + e);
        }
    }

    async function handleDeleteSavePost() {
        try {
            const response = await axios.get(`http://localhost:3000/user/deleteSavedPost/${postID}`,
                { withCredentials: true },
            )
            const data = response.data;

            if (data.status === 'success') {
                toast.success('Removed from saved posts', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                setSaved(false);
                console.log('Removed post from saved items');
            }
            else {
                toast.error('Error removing from saved posts', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                console.log('Error : ' + data.message);
            }
        }
        catch (e) {
            toast.error('Error removing from saved posts', {
                position: "bottom-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            console.log('Error saving post : ' + e);
        }
    }


    return (
        <div style={{
            width: '70%',
            marginLeft: '5rem',
        }}>
            <div className='d-flex align-items-center'>
                {avatarURL === ''
                    ? <FontAwesomeIcon style={{ marginRight: '1rem' }} icon={faUser} />
                    : <img className='profileImage' src={`data:image/jpeg;base64,${avatarURL}`} alt="profile avatar" />
                }

                <h5 className='usernameText'> <Link className='link' to={`/user/${post?.username}`}>{post?.username}</Link> </h5>
            </div>

            <div className="d-flex justify-content-between align-items-center">
                <h1> {post?.heading} </h1>

                <Dropdown>
                    <Dropdown.Toggle style={{
                        scale: '75%',
                        color: 'black',
                        backgroundColor: 'transparent',
                        borderRadius: '5px',
                    }} id='dropdown'>
                        <FontAwesomeIcon icon={faEllipsis} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item >
                            {saved
                                ?
                                <h6 onClick={handleDeleteSavePost}>
                                    <FontAwesomeIcon className='icons'
                                        style={{
                                            paddingRight: '1rem',
                                        }} icon={faBookmarkSolid}
                                    />
                                    Remove
                                </h6>
                                :
                                <h6 onClick={handleSavePost}>
                                    <FontAwesomeIcon className='icons'
                                        style={{
                                            paddingRight: '1rem',
                                        }} icon={faBookmarkRegular}
                                    />
                                    Save
                                </h6>
                            }
                        </Dropdown.Item>

                        <Dropdown.Item>
                            <h6 onClick={() => handleClipboard(post?._id)}>
                                <FontAwesomeIcon className='icons'
                                    style={{
                                        paddingRight: '1rem',
                                    }} icon={faClipboard}
                                />
                                Copy Link
                            </h6>
                        </Dropdown.Item>

                        <Dropdown.Item>
                            {globalUsername === post?.username &&
                                <h6 onClick={handleDelete}>
                                    <FontAwesomeIcon className='icons'
                                        style={{
                                            color: 'red',
                                            paddingRight: '1rem',
                                        }} icon={faTrash}
                                    />
                                    Delete Post
                                </h6>
                            }
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <h5> {timeAgo} </h5>

            <hr />

            <h4> {post?.body} </h4>

            {/* post image */}
            {post?.base64String &&
                <img
                    style={{
                        borderRadius: '15px',
                        width: '80%',
                        maxHeight: '800px',
                        margin: '2rem 0rem 2rem 0rem',
                    }} src={`data:image/jpeg;base64,${post.base64String}`} alt="uploaded image"
                />
            }

            {liked ? (
                <h5 style={{ cursor: 'pointer' }} onClick={handleDislike}>
                    {likeCount}
                    <FontAwesomeIcon className='icons'
                        style={{
                            color: 'red',
                            padding: '0rem 0.5rem 0rem 1rem',
                        }}
                        icon={faHeartSolid}
                    />
                    Dislike
                </h5>
            ) : (
                <h5 style={{ cursor: 'pointer' }} onClick={handleLike}>
                    {likeCount}
                    <FontAwesomeIcon className='icons'
                        style={{
                            padding: '0rem 0.5rem 0rem 1rem',
                        }}
                        icon={faHeartRegular}
                    />
                    Like
                </h5>
            )}

            <div className="d-flex flex-column gap-3 mt-5">
                <h4> Comments </h4>

                <form onSubmit={handleSubmit}>
                    <div>
                        <div>
                            <textarea name="newComment" style={{ width: '50%' }} className="form-control" id="validationTextarea" placeholder="share your thoughts..." required
                                onChange={(e) => setNewComment(e.target.value)}
                            ></textarea>
                            <div className="invalid-feedback">
                                cant be empty
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 mb-2">
                        <button className="btn btn-warning" type="submit"> Comment </button>
                    </div>
                </form>

                {post?.comments
                    ?
                    post.comments.map((comment, index) => {
                        return <Comment
                            key={index}
                            comment={comment}
                            username={comment.username}
                            postID={post._id}
                        />
                    })
                    :
                    <h4> No comments </h4>
                }
            </div>

        </div>
    );
}