import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid, faUser } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faMessage, faClipboard } from '@fortawesome/free-regular-svg-icons';

import { handleClipboard } from '../helpers/Clipboard';
import { handleLike } from '../helpers/Like';
import { handleDislike } from '../helpers/Dislike';
import { getLikeInclude } from '../helpers/LikeInclude';
import { fetchUser } from '../helpers/FetchUser';
import { getPost } from '../helpers/GetPost';

import 'react-toastify/dist/ReactToastify.css';
import '../index.css'

export function PostCard({ postID }) {
    const [post, setPost] = useState({});
    const [username, setUsername] = useState('');
    const [liked, setLiked] = useState(false);
    const [likeCount, setlikeCount] = useState(0);
    const [timeAgo, setTimeAgo] = useState('');
    const [avatarURL, setAvatarURL] = useState('');

    //fetching post with it's id
    useEffect(() => {

        getPost(postID, setPost, setUsername, setlikeCount);
        getLikeInclude(postID, setLiked);
    }, [postID]);

    useEffect(() => {
        if (post?.createdAt) {
            const date = parseISO(post.createdAt);
            const formattedTime = formatDistanceToNow(date, { addSuffix: true });
            setTimeAgo(formattedTime);
        }

        fetchUser('POST', username, setAvatarURL, null, null, null, null);
    }, [post]);


    if (!post) return;

    return (
        <div className='PostCard'>

            <div className='d-flex align-items-center'>
                {avatarURL === ''
                    ? <FontAwesomeIcon className='icons' style={{ marginRight: '1rem' }} icon={faUser} />
                    : <img className='profileImage' src={`data:image/jpeg;base64,${avatarURL}`} alt="profile avatar" />
                }
    
                <h5> <Link className='link' to={`/user/${post?.username}`}>{post?.username}</Link> </h5>

            </div>
            <h1> <Link className='link' to={`/post/${post?._id}`}> {post?.heading} </Link> </h1>
            <h5> {timeAgo} </h5>

            <hr />

            <h4 className='mb-3 postBody'> {post?.body} </h4>

            {/* post image */}
            <div className='d-flex justify-content-center align-items-center mb-3'>
                {post?.base64String && <img
                    style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '15px',
                    }} src={`data:image/jpeg;base64,${post?.base64String}`} alt="post image" />}
            </div>

            <div className="postLinks">
                {/* Like count */}
                {liked ? (
                    <h5 style={{ cursor: 'pointer' }} onClick={() => handleDislike(postID, setlikeCount, setLiked)}>
                        {likeCount}
                        <FontAwesomeIcon className='icons'
                            style={{
                                color: 'red',
                                padding: '0rem 0.5rem 0rem 1rem',
                            }}
                            icon={faHeartSolid}
                        />
                        <span className='postLinksText'> Dislike </span>
                    </h5>
                ) : (
                    <h5 style={{ cursor: 'pointer' }} onClick={() => handleLike(postID, setlikeCount, setLiked)}>
                        {likeCount}
                        <FontAwesomeIcon className='icons'
                            style={{
                                padding: '0rem 0.5rem 0rem 1rem',
                            }}
                            icon={faHeartRegular}
                        />
                        <span className='postLinksText'> Like </span>
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
                        <span className='postLinksText'> Comments </span>
                    </h5>
                </Link>


                <h5 onClick={() => handleClipboard(post?._id)}
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
                    <span className='postLinksText'> Copy </span>
                </h5>
            </div>

        </div>
    );
}