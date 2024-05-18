import axios from 'axios'
import { useEffect, useState } from "react";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { usernameState, isLoggedInState } from '../atoms';
import { useRecoilState } from 'recoil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../index.css'

export function Comment({ index, comment, username, postID }) {
    const [timeAgo, setTimeAgo] = useState('');
    const [avatarURL, setAvatarURL] = useState('');
    const [globalUsername, setGlobalUsername] = useRecoilState(usernameState);


    useEffect(() => {
        if (comment?.createdAt) {
            const date = parseISO(comment.createdAt);
            const formattedTime = formatDistanceToNow(date, { addSuffix: true });
            setTimeAgo(formattedTime);
        }

        async function fetchUser() {
            try {
                if (username === '') return;

                const response = await axios.get(`http://localhost:3000/user/${username}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                        }
                    }
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
    }, [comment]);

    async function handleCommentDelete() {
        try {
            const response = await axios.get(`http://localhost:3000/post/${postID}/deleteComment/${comment._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                    }
                }
            );

            const data = response.data;
            if (data.status === 'success') {
                console.log('Deleted comment');
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
                console.log('Failed to delete comment : ' + data.message);
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
        <div className='mb-3'>
            <div className='d-flex align-items-center'>
                {avatarURL === ''
                    ? <FontAwesomeIcon className='icons' style={{ marginRight: '1rem' }} icon={faUser} />
                    : <img className='profileImage' src={`data:image/jpeg;base64,${avatarURL}`} alt="profile avatar" />
                }

                <div className='d-flex gap-3 mt-3'>
                    <h5> <Link className='link' to={`/user/${username}`}>{username}</Link> </h5>
                    <p> {timeAgo}</p>
                </div>

                {globalUsername === username &&
                    <FontAwesomeIcon className='icons' style={{ color: 'red', cursor: 'pointer', marginLeft: '3rem' }} onClick={handleCommentDelete} icon={faTrash} />
                }
            </div>

            <p> {comment.content} </p>

        </div>
    )
}