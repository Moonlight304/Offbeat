import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import default_avatar from '../assets/default_avatar.jpg'

export function User() {
    const { username } = useParams();
    const [userData, setUserData] = useState(undefined);
    const [imageURL, setImageURL] = useState('');
    const navigate = useNavigate();

    function imageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = error => {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    }

    async function handleImageChange(e) {
        e.preventDefault();

        // console.log(e.target.files[0]);

        const file = e.target.files[0];
        const base64String = await imageToBase64(file);
        try {
            const response = await axios.post(`http://localhost:3000/user/uploadAvatar`,
                { base64String },
                { withCredentials: true },
            )
            const data = response.data;
            console.log(data);

            if (data.status === 'success') {
                const url = URL.createObjectURL(file);
                setImageURL(url);
            }
            else
                navigate(`/user/${username}`);

            window.location.reload();
        }
        catch (e) {
            console.log('Error : ' + e);
        }
    }

    async function handleAvatarDelete() {
        try {
            const response = await axios.get(`http://localhost:3000/user/deleteAvatar/${username}`,
                { withCredentials: true },
            )
            const data = response.data;

            if (data.status === 'success')
                console.log('avatar deleted successfully');
            else
                console.log('avatar deletion failed : ' + data.message);

            console.log(data.user);

            // navigate(`/`);
            window.location.reload();
        }
        catch (e) {
            console.log('Error : ' + e);
        }
    }

    async function handleAccountDelete() {
        try {
            alert('Delete Account?');

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

            <input type="file" name="avatar" id="avatar" accept=".png, .jpg" onChange={handleImageChange} />

            {imageURL
                ?
                <>
                    <label htmlFor="avatar"> <img src={`data:image/jpeg;base64,${imageURL}`} alt="uploaded image" /> </label>
                    <button onClick={handleAvatarDelete}>Delete Avatar</button>
                </>
                : <label htmlFor="avatar"> <img src={default_avatar} alt="default_avatar" /> </label>
            }

            <h1> {username} </h1>


            <button> <Link className="nav-link active" aria-current="page" to={'/logout'}> Logout </Link> </button>
            <button onClick={handleAccountDelete}>Delete Account</button>

            {/* {console.log(userData)} */}

            {userData && userData.posts && userData.posts.length > 0 ? (
                <>
                    <h2> Your Posts </h2>
                    {userData.posts.map((post, index) => (
                        <div key={index}>
                            <h1 key={post?._id}>
                                <Link to={`/post/${post?._id}`}>{post?.heading}</Link>
                            </h1>
                            <h4> --- <Link to={`/user/${post?.username}`}>{post?.username}</Link> </h4>
                        </div>
                    ))}
                </>
            ) : (
                <h1> No Posts </h1>
            )}



        </>
    );
}