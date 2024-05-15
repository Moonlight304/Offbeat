import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import default_avatar from '../assets/default_avatar.jpg'
import { PostList } from "./PostList";
import { usernameState } from '../atoms';
import { useRecoilState } from "recoil";

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

            if (data.status === 'success')
                console.log('deleted account');
            else
                console.log('account deletion failed : ' + data.message);
            navigate('/logout');
        }
        catch (e) {
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
                    console.log('error fetching user : ' + data.message);
                    navigate('/');
                }
            }
            catch (e) {
                console.log('Error : ' + e);
            }
        }

        fetchUser();
    }, [])


    return (
        <>

            {imageURL
                ? <img src={`data:image/jpeg;base64,${imageURL}`} alt="uploaded image" />
                : <img src={default_avatar} alt="default_avatar" />
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