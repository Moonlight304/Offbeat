import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { PostList } from "./PostList";
import { usernameState } from '../atoms';
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../index.css'

export function User() {
    const { username } = useParams();
    const [userData, setUserData] = useState({});
    const [imageURL, setImageURL] = useState('');
    const [isPosts, setIsPosts] = useState(true);
    const [globalUsername, setGlobalUsername] = useRecoilState(usernameState);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const navigate = useNavigate();


    async function handleAccountDelete() {
        try {
            const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');

            if (!confirmDelete) {
                console.log('Account deletion cancelled');
                return;
            }

            const response = await axios.get(`http://localhost:3000/user/deleteUser/${username}`,
                { withCredentials: true },
            )
            const data = response.data;

            if (data.status === 'success') {
                toast.success(`${data.message}`, {
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
                console.log('deleted account');
            }
            else {
                toast.error(`${data.message}`, {
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
                console.log('account deletion failed : ' + data.message);
            }
            
            navigate('/logout');
        }
        catch (e) {
            toast.error('Deletion failed', {
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
            console.log('Error : ' + e);
        }
    }

    async function handleFollow() {
        try {
            const response = await axios.post('http://localhost:3000/user/follow',
                { srcUsername: globalUsername, destUsername: username },
                { withCredentials: true },
            )
            const data = response.data;

            if (data.status === 'success') {
                setFollowersCount(followersCount + 1);
                console.log('followed user');
            }
            else
                console.log('Error : ' + data.message);
        }
        catch (e) {
            console.log('Error : ' + e);
        }
    }

    async function handleUnfollow() {
        try {
            const response = await axios.post('http://localhost:3000/user/unfollow',
                { srcUsername: globalUsername, destUsername: username },
                { withCredentials: true },
            )
            const data = response.data;

            if (data.status === 'success') {
                setFollowersCount(followersCount - 1);
                console.log('unfollowed user');
            }
            else
                console.log('Error : ' + data.message);
        }
        catch (e) {
            console.log('Error : ' + e);
        }
    }

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await axios.get(`http://localhost:3000/user/${username}`,
                    { withCredentials: true },
                )
                const data = response.data;

                if (data.status === 'success') {
                    setUserData(data.userData);
                    setImageURL(data.userData.avatarString);
                    setFollowersCount(data.userData.followersCount);
                    setFollowingCount(data.userData.followingCount);
                }
                else {
                    toast.error('User not found', {
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
                    console.log('error fetching user : ' + data.message);
                    navigate('/');
                }
            }
            catch (e) {
                console.log('Error : ' + e);
                toast.error('Error loading user profile', {
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

        fetchUser();
    }, [username])


    return (
        <>
            {imageURL
                ? <img className='userIcon' src={`data:image/jpeg;base64,${imageURL}`} alt="uploaded image" />
                : <FontAwesomeIcon className='navbarIcon' icon={faUser} />
            }

            <h1> {username} </h1>

            <h3> Followers {followersCount} </h3>
            <h3> Following {followingCount} </h3>

            {globalUsername !== username &&
                <>
                    <button onClick={handleFollow}>Follow</button>
                    <button onClick={handleUnfollow}>Unfollow</button>
                </>
            }

            <h3> {userData?.bio} </h3>

            {globalUsername === username &&
                <>
                    <button onClick={() => { navigate(`/user/editUser/${username}`) }}> Edit Profile </button>
                    <button> <Link className="nav-link active" aria-current="page" to={'/logout'}> Logout </Link> </button>
                    <button onClick={handleAccountDelete}>Delete Account</button>
                </>
            }

            {/* {console.log(userData)} */}

            <br />
            <button onClick={() => setIsPosts(true)}> Posts </button>
            {globalUsername === username && <button onClick={() => setIsPosts(false)}> Saved Posts </button>}


            {
                userData && isPosts
                    ? <PostList title={'Posts'} posts={userData?.posts} />
                    : <PostList title={'Saved Posts'} posts={userData?.savedPosts} />
            }

        </>
    );
}