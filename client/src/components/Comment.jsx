import axios from 'axios'
import { useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Comment({ index, comment, postID }) {
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        if (comment?.createdAt) {
            const date = parseISO(comment.createdAt);
            const formattedTime = formatDistanceToNow(date, { addSuffix: true });
            setTimeAgo(formattedTime);
        }
    }, [comment]);

    async function handleCommentDelete() {
        try {
            const response = await axios.get(`http://localhost:3000/post/${postID}/deleteComment/${comment._id}`,
                { withCredentials: true },
            );

            const data = response.data;
            if (data.status === 'success') {
                console.log('deleted comment');
            }
            else {
                toast.error('Error deleting comment', {
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
                console.log('failed to delete comment : ' + data.message);
            }

            // navigate(`/post/${postID}`);
            window.location.reload();
        }
        catch (e) {
            console.log('Error in deleting comment : ' + e);
            toast.error('Error deleting comment', {
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

    return (
        <div>

            <p> <Link to={`/user/${comment?.username}`}>{comment?.username}</Link> </p>
            <p> {comment.content} </p>
            <p> {timeAgo} </p>

            <button onClick={handleCommentDelete}> Delete </button>
        </div>
    )
}