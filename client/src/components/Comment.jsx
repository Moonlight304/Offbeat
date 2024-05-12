import axios from 'axios'
import { useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

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
            if (data.status === 'success')
                console.log('deleted comment');
            else
                console.log('failed to delete comment : ' + data.message);

            // navigate(`/post/${postID}`);
            window.location.reload();
        }
        catch (e) {
            console.log('Error in deleting comment : ' + e);
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