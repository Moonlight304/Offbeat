import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usernameState } from '../atoms';
import { useRecoilState } from "recoil";
import { imageToBase64 } from "../helpers/imageToBase64";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../index.css'

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

        try {
            const file = e.target.files[0];
            const base64String = await imageToBase64(file);
            const response = await axios.post(`http://localhost:3000/user/uploadAvatar`,
                { base64String },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                    }
                }
            )
            const data = response.data;

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
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                    }
                }
            )
            const data = response.data;

            if (data.status === 'success') {
                console.log('Avatar deleted successfully');
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
                console.log('Avatar deletion failed : ' + data.message);
            }

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
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                    }
                }
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
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                        }
                    }
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
                    console.log('Error fetching user : ' + data.message);
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
        <div className="userInfo">
            {globalUsername === username &&
                <input style={{ display: 'none' }} type="file" name="avatar" id="avatar" accept=".png, .jpg" onChange={handleAvatarChange} />
            }

            <div>
                {imageURL
                    ?
                    <div className="d-flex flex-column align-items-center">
                        <img className="accountImage" src={`data:image/jpeg;base64,${imageURL}`} alt="uploaded image" />
                        <div className="accountImageSettings">
                            <button className="w-50"><label style={{ cursor: 'pointer' }} htmlFor="avatar">
                                <FontAwesomeIcon icon={faPen} /> Edit Avatar </label>
                            </button>

                            <button className="w-50" onClick={handleAvatarDelete}> <FontAwesomeIcon style={{ color: 'red' }} icon={faTrash} /> Delete Avatar</button>
                        </div>
                    </div>
                    :
                    <div>
                        <FontAwesomeIcon style={{ border: '0px' }} className='navbarIcon accountImage' icon={faUser} />
                        <div className="accountImageSettings">
                            <button className="w-50"><label style={{ cursor: 'pointer' }} htmlFor="avatar">
                                <FontAwesomeIcon icon={faPen} /> Edit Avatar </label>
                            </button>
                        </div>
                    </div>
                }
            </div>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-5">
                <div className="editProfileInputs">
                    <label htmlFor="email"><h4> Email </h4></label>
                    <input type="email" name="email" id="email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="editProfileInputs">
                    <label htmlFor="gender"> <h4> Gender </h4> </label>
                    <select name="gender" id="gender" value={gender}
                        onChange={(e) => setGender(e.target.value)}
                    >
                        <option value="none"> Dont say </option>
                        <option value="Male"> Male </option>
                        <option value="Female"> Female </option>
                    </select>
                </div>

                <div className="editProfileInputs">
                    <label htmlFor="bio"><h4> Bio </h4></label>
                    <textarea cols='25' name="bio" id="bio" value={bio} onChange={(e) => setBio(e.target.value)}
                    ></textarea>
                </div>

                <input className="btn btn-warning" style={{ width: '50%', fontWeight: '600' }} type="submit" value="Save" />
            </form>
        </div>
    );
}