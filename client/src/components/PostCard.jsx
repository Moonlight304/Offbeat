import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from 'date-fns';


export function PostCard({ postID }) {
    const [post, setPost] = useState({});
    const [likeCount, setlikeCount] = useState(0);
    const [timeAgo, setTimeAgo] = useState('');
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
    }, [likeCount, postID]);

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
        <div className='mb-5'>
            <h5> <Link to={`/user/${post?.username}`}>{post?.username}</Link> </h5>
            <h1> <Link to={`/post/${post?._id}`}> {post?.heading} </Link> </h1>
            <button onClick={handleClipboard}> Copy to clipboard </button>

            <h5> {timeAgo} </h5>

            <h4> {post?.body} </h4>

            {/* post image */}
            {post?.base64String && <img src={`data:image/jpeg;base64,${post.base64String}`} alt="uploaded image" />}

            <h5> Likes : {likeCount} </h5>
            <button onClick={handleLike}> Like Post </button>
            <button onClick={handleDislike}> Dislike Post </button>
        </div>
    );
}