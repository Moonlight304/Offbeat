import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Comment } from './Comment';
import { Link } from 'react-router-dom';
import { usernameState, isLoggedInState } from '../atoms';
import { useRecoilState } from 'recoil';

export function Post() {
    const { postID } = useParams();
    const [post, setPost] = useState({});
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
                setlikeCount(data.post.likeCount);
            }
            catch (e) {
                console.log('Error fetching post : ' + e);
            }
        }

        getPost();
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
            }
            else
                console.log('ERROR : ' + data.message);
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
            }
            else
                console.log('ERROR : ' + data.message);
        }
        catch (e) {
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
                console.log('deleted post');
                navigate('/');
            }
            else {
                console.log('ERROR : ' + data.message);
            }
        }
        catch (e) {
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

            if (data.status === 'success')
                console.log('comment added');
            else
                console.log('comment added');

            // navigate(`/post/${postID}`);
            window.location.reload();
        }
        catch (e) {
            console.log('Error during "newComment" : ' + e);
        }
    }

    async function handleSavePost() {
        try {
            const response = await axios.get(`http://localhost:3000/user/savePost/${postID}`,
                { withCredentials: true },
            )
            const data = response.data;

            if (data.status === 'success')
                console.log('Saved Post');
            else
                console.log('Error : ' + data.message);
        }
        catch (e) {
            console.log('Error saving post : ' + e);
        }
    }

    async function handleDeleteSavePost() {
        try {
            const response = await axios.get(`http://localhost:3000/user/deleteSavedPost/${postID}`,
                { withCredentials: true },
            )
            const data = response.data;

            if (data.status === 'success')
                console.log('Removed post from saved items');
            else
                console.log('Error : ' + data.message);
        }
        catch (e) {
            console.log('Error saving post : ' + e);
        }
    }

    function handleClipboard() {
        if (!navigator.clipboard) {
            console.log('Clipboard API not supported');
            return;
        }

        try {
            const postID = post?._id;
            if (!postID) {
                console.log('Post ID is not defined');
                return;
            }
            const copyURL = `${window.location.origin}/post/${post?._id}`;
            navigator.clipboard.writeText(copyURL);
            console.log('Copied to clipboard');
        }
        catch (e) {
            console.log('Error copying to clipboard : ' + e);
        }
    }

    return (
        <>
            <h1> {post?.heading} </h1>

            <button onClick={handleSavePost}> Save Post </button>
            <button onClick={handleDeleteSavePost}> Remove from Saved </button>
            <br />
            <button onClick={handleClipboard}> Copy to clipboard </button>
            {globalUsername === post?.username &&
                <button onClick={handleDelete}> Delete Post </button>
            }

            <h4> <Link to={`/user/${post?.username}`}>{post?.username}</Link> </h4>

            <h5> Likes : {likeCount} </h5>
            <button onClick={handleLike}> Like Post </button>
            <button onClick={handleDislike}> Dislike Post </button>

            <h5> {timeAgo} </h5>

            <h4> {post?.body} </h4>

            {/* post image */}
            {post?.base64String && <img src={`data:image/jpeg;base64,${post.base64String}`} alt="uploaded image" />}

            <h4>Comments: </h4>

            <form className="row g-3 needs-validation" onSubmit={handleSubmit}>
                <div className="col-md-4">
                    <div className="mb-3">
                        <textarea name="newComment" className="form-control" id="validationTextarea" placeholder="share your thoughts..." required
                            onChange={(e) => setNewComment(e.target.value)}
                        ></textarea>
                        <div className="invalid-feedback">
                            cant be empty
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <button className="btn btn-primary" type="submit"> Comment </button>
                </div>
            </form>

            {post?.comments
                ?
                post.comments.map((comment, index) => {
                    return <Comment
                        key={index}
                        comment={comment}
                        postID={post._id}
                    />
                })
                :
                <h4> No comments </h4>
            }
        </>
    );
}