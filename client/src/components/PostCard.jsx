import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faMessage, faClipboard } from '@fortawesome/free-regular-svg-icons';

import '../index.css'

export function PostCard({ postID }) {
    const [post, setPost] = useState({});
    const [liked, setLiked] = useState(false);
    const [likeCount, setlikeCount] = useState(0);
    const [timeAgo, setTimeAgo] = useState('');

    //fetching post with it's id
    useEffect(() => {
        async function getPost() {
            try {
                const response = await axios.get(`http://localhost:3000/post/${postID}`);
                const data = response.data;
                console.log(data);

                setPost(data.post);
                setlikeCount(data.post.likeCount);
            }
            catch (e) {
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
                console.log('Error during "like" operation : ' + e);
            }
        }

        getPost();
        getLikeInclude();
    }, [postID]);

    useEffect(() => {
        if (post?.createdAt) {
            const date = parseISO(post.createdAt);
            const formattedTime = formatDistanceToNow(date, { addSuffix: true });
            setTimeAgo(formattedTime);
        }
    }, [post]);

    async function handleLike() {
        try {
            const response = await axios.get(`http://localhost:3000/post/like/${postID}`,
                { withCredentials: true },
            )
            const data = response.data;

            if (data.status === 'success') {
                console.log('Liked post');
                setlikeCount(data.newLikeCount);
                setLiked(true); 
            }
            else {
                console.log('ERROR : ' + data.message);
                
            }
        }
        catch (e) {
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
                console.log('disliked post');
                setlikeCount(data.newLikeCount);
                setLiked(false);
                
            }
            else {
                console.log('ERROR : ' + data.message);
                
            }
        }
        catch (e) {
            console.log('Error during "dislike" operation : ' + e);
            
        }
    }

    function handleClipboard() {
        if (!navigator.clipboard) {
            console.log('Clipboard API not supported');
            toast.error('Clipboard API not supported', {
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
            return;
        }

        try {
            const postID = post?._id;
            if (!postID) {
                console.log('Post ID is not defined');
                toast.error('No post found', {
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
                return;
            }
            const copyURL = `${window.location.origin}/post/${post?._id}`;
            navigator.clipboard.writeText(copyURL);
            console.log('Copied to clipboard');
            toast.success('Copied to clipboard!', {
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
        catch (e) {
            console.log('Error copying to clipboard : ' + e);
            toast.error('Error copying to clipboard', {
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
    }

    if (!post) return;

    return (
        <div className='PostCard'>
            <h5 className='usernameText'> <Link className='link' to={`/user/${post?.username}`}>{post?.username}</Link> </h5>
            <div className='d-flex justify-content-between align-items-center'>

                <h1> <Link className='link' to={`/post/${post?._id}`}> {post?.heading} </Link> </h1>

            </div>
            <h5> {timeAgo} </h5>

            <hr />

            <h4 className='mb-3'> {post?.body} </h4>

            {/* post image */}
            <div className='d-flex justify-content-center align-items-center mb-3'>
                {post?.base64String && <img
                    style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '15px',
                    }} src={`data:image/jpeg;base64,${post?.base64String}`} alt="post image" />}
            </div>

            <div className="d-flex justify-content-between align-items-center ps-5 pe-5">
                {/* Like count */}
                {liked ? (
                    <h5>
                        {likeCount}
                        <FontAwesomeIcon
                            style={{
                                cursor: 'pointer',
                                scale: '120%',
                                paddingLeft: '.5rem',
                            }}
                            onClick={handleDislike}
                            icon={faHeartSolid}
                        />
                    </h5>
                ) : (
                    <h5>
                        {likeCount}
                        <FontAwesomeIcon
                            style={{
                                cursor: 'pointer',
                                scale: '120%',
                                paddingLeft: '.5rem',
                            }}
                            onClick={handleLike}
                            icon={faHeartRegular}
                        />
                    </h5>
                )}

                <Link className='link text-black' to={`/post/${post?._id}`}>
                    <h5
                        style={{
                            cursor: 'pointer',
                        }}> <FontAwesomeIcon
                            style={{
                                scale: '120%',
                                paddingRight: '1rem',
                            }} icon={faMessage}
                        />
                        Comments
                    </h5>
                </Link>


                <h5 onClick={handleClipboard}
                    style={{
                        cursor: 'pointer',
                    }}>
                    <FontAwesomeIcon
                        style={{
                            cursor: 'pointer',
                            scale: '120%',
                            paddingRight: '1rem',
                        }} icon={faClipboard}
                    />
                    Copy to clipboard
                </h5>
            </div>
        </div>
    );
}