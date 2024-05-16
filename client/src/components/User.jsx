import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useRouteLoaderData } from "react-router-dom";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { PostList } from "./PostList";
import { usernameState } from '../atoms';
import { useRecoilState } from "recoil";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGear } from '@fortawesome/free-solid-svg-icons';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../index.css'

export function User() {
    const { username } = useParams();
    const [userData, setUserData] = useState({});
    const [imageURL, setImageURL] = useState('');
    const [isPosts, setIsPosts] = useState(true);
    const [globalUsername, setGlobalUsername] = useRecoilState(usernameState);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const handleShow = () => setShow(true);


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
                toast.success(`Following ${username}`, {
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
                setFollowersCount(followersCount + 1);
                setIsFollowing(true);
                console.log('followed user');
            }
            else {
                toast.warn('Login to follow user', {
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
            toast.error('Error following user', {
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

    async function handleUnfollow() {
        try {
            const response = await axios.post('http://localhost:3000/user/unfollow',
                { srcUsername: globalUsername, destUsername: username },
                { withCredentials: true },
            )
            const data = response.data;

            if (data.status === 'success') {
                toast.success(`Unfollowed ${username}`, {
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
                setFollowersCount(followersCount - 1);
                setIsFollowing(false);
                console.log('unfollowed user');
            }
            else {
                toast.error('Couldn\'t unfollow user', {
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
            toast.error('Error unfollowing user', {
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


        async function getIsFollowing() {
            try {
                const response = await axios.post('http://localhost:3000/user/getIsFollowing',
                    { srcUsername: globalUsername, destUsername: username },
                    { withCredentials: true },
                )
                const data = response.data;
                console.log(data);

                if (data.status === 'success') {
                    setIsFollowing(JSON.parse(data.message));
                }
                else {
                    console.log('Error : ' + data.message);
                    if (data.message !== 'no token found')
                        toast.error('Login to follow user', {
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
            catch (e) {
                console.log('Error : ' + e);
                toast.error('Error following', {
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
        getIsFollowing();
    }, [username])


    return (
        <>
            <div className="mt-5 d-flex justify-content-center gap-5">
                {imageURL
                    ? <img className="accountImage" src={`data:image/jpeg;base64,${imageURL}`} alt="uploaded image" />
                    : <FontAwesomeIcon style={{
                        width: '15rem',
                        height: '15rem',
                    }} className='navbarIcon' icon={faUser} />
                }

                <div className="ms-5 d-flex flex-column gap-3">
                    <div className="d-flex gap-5 align-items-center justify-items-between">
                        <h2> {username} </h2>

                        {globalUsername !== username
                            ? (
                                isFollowing
                                    ? <button className="btn btn-danger" onClick={handleUnfollow}>Unfollow</button>
                                    : <button className="btn btn-primary" onClick={handleFollow}>Follow</button>
                            )
                            :
                            <>
                                <button className="btn btn-info" onClick={() => { navigate(`/user/editUser/${username}`) }}> Edit Profile </button>
                                <FontAwesomeIcon style={{ scale: '150%', cursor: 'pointer' }} className="icons" onClick={handleShow} data-toggle="modal" data-target="#optionsModal" icon={faGear} />
                            </>
                        }
                    </div>


                    <div className="d-flex gap-5">
                        <h5> {userData?.posts?.length} Posts </h5>
                        <h5> {followersCount} Followers </h5>
                        <h5> {followingCount} Following </h5>
                    </div>

                    <h5> {userData?.bio} </h5>
                </div>
            </div >


            <div className="d-flex flex-column mt-5 align-items-center">
                <div className="d-flex gap-5 mb-3">
                    <button className="btn btn-primary" onClick={() => setIsPosts(true)}> Posts </button>
                    {globalUsername === username && <button className="btn btn-secondary" onClick={() => setIsPosts(false)}> Saved Posts </button>}
                </div>

                {/* Post lists */}
                {
                    userData && isPosts
                        ? <PostList title={'Posts'} posts={userData?.posts} />
                        : <PostList title={'Saved Posts'} posts={userData?.savedPosts} />
                }
            </div>


            <Modal centered id='optionsModal' show={show} onHide={() => { setShow(false) }}
                style={{
                    display: 'block',
                    backdropFilter: 'blur(3px)',
                    width: '1500px',
                }}
            >
                <div className="d-flex flex-column gap-2 p-2 justify-content-center align-items-center">

                    {globalUsername === username &&
                        <>

                            <button className="btn btn-warning w-50"> <Link className="nav-link active" aria-current="page" to={'/logout'}> Logout </Link> </button>
                            <button className="btn btn-danger w-50" onClick={handleAccountDelete}>Delete Account</button>
                        </>
                    }

                </div>

            </Modal >


        </>
    );
}