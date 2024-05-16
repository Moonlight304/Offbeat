import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { usernameState } from '../atoms';
import { useRecoilState } from "recoil";
import { imageToBase64 } from "../helpers/imageToBase64";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function EditUser() {
    const { username } = useParams();
    const [userData, setUserData] = useState({});
    const [imageURL, setImageURL] = useState('');
    const [globalUsername, setGlobalUsername] = useRecoilState(usernameState);
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [gender, setGender] = useState('none');
    const navigate = useNavigate();

    async function handleAvatarChange(e) {
        e.preventDefault();

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
            else {
                toast.error('Error updating avatar', {
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

            // navigate(`/user/editUser/${username}`);
            window.location.reload();
        }
        catch (e) {
            toast.error('Error updating avatar', {
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

    async function handleAvatarDelete() {
        try {
            const response = await axios.get(`http://localhost:3000/user/deleteAvatar/${username}`,
                { withCredentials: true },
            )
            const data = response.data;

            if (data.status === 'success') {
                console.log('avatar deleted successfully');
            }
            else {
                toast.error('Error deleting avatar', {
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
                console.log('avatar deletion failed : ' + data.message);
            }

            console.log(data.user);

            // navigate(`/`);
            window.location.reload();
        }
        catch (e) {
            toast.error('Error deleting avatar', {
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

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:3000/user/editUser/${username}`,
                { email, bio, gender },
                { withCredentials: true },
            )
            const data = response.data;

            if (data.status === 'success') {
                toast.success('Profile updated', {
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
                console.log('Updated profile');
            }
            else {
                toast.error('Error updating profile', {
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

            navigate(`/user/${username}`);
        }
        catch (e) {
            toast.error('Error updating profile', {
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
                    setEmail(data.userData.email || '');
                    setBio(data.userData.bio || '');
                    setGender(data.userData.gender || '');
                }
                else {
                    toast.error('Error loading profile', {
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
                toast.error('Error loading profile', {
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

        fetchUser();
    }, [])

    return (
        <>
            {globalUsername === username && <input type="file" name="avatar" id="avatar" accept=".png, .jpg" onChange={handleAvatarChange} />}

            {imageURL
                ?
                <>
                    <label htmlFor="avatar"> <img src={`data:image/jpeg;base64,${imageURL}`} alt="uploaded image" /> </label>
                    <button onClick={handleAvatarDelete}>Delete Avatar</button>
                </>
                : <label htmlFor="avatar"> <FontAwesomeIcon className='navbarIcon' icon={faUser} /> </label>
            }

            <form onSubmit={handleSubmit}>
                <label htmlFor="email"><h3> Edit email </h3></label>
                <input type="email" name="email" id="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="bio"><h3> Edit bio </h3></label>
                <input type="text" name="bio" id="bio" value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />

                <label htmlFor="gender"> <h3> Gender </h3> </label>
                <select name="gender" id="gender" value={gender}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <option value="none"> Dont say </option>
                    <option value="Male"> Male </option>
                    <option value="Female"> Female </option>
                </select>

                <input type="submit" value="Save" />
            </form>
        </>
    );
}