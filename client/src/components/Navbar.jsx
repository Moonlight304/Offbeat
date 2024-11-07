import axios from 'axios';
const backendURL = import.meta.env.VITE_backendURL;
import { Link, useNavigate } from "react-router-dom";
import { usernameState, isLoggedInState } from '../atoms'
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { imageToBase64 } from '../helpers/imageToBase64';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus, faXmark, faBell, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { Modal, Button } from "react-bootstrap";
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../index.css'

export function Navbar() {
    const [globalUsername, setGlobalUsername] = useRecoilState(usernameState);
    const [globalIsLoggedIn, setGlobalIsLoggedIn] = useRecoilState(isLoggedInState);
    const [userID, setUserID] = useState('');
    const [avatarURL, setAvatarURL] = useState('');
    const [show, setShow] = useState(false);
    const [heading, setHeading] = useState('');
    const [body, setBody] = useState('');
    const [imageURL, setImageURL] = useState(null);
    const navigate = useNavigate();
    const handleShow = () => setShow(true);

    const [notificationsArray, setNotificationsArray] = useState([]);
    const [notificationLength, setNotificationLength] = useState();
    const [showNotifications, setShowNotifications] = useState(false);

    async function handleImageChange(e) {
        e.preventDefault();

        try {
            // console.log(e.target.files[0]);

            const file = e.target.files[0];

            const url = URL.createObjectURL(file);
            setImageURL(url);
        }
        catch (e) {
            toast.error('Error updating image', {
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

    async function handleMarkRead(notificationID) {
        try {
            const response = await axios.get(`${backendURL}/user/${userID}/notifications/${notificationID}/delete`, 
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`
                    }
                }
            );

            const data = response.data;

            if (data.status == 'success') {
                const updatedNotifications = notificationsArray.filter(
                    (notification) => notification._id !== notificationID
                );
        
                setNotificationsArray(updatedNotifications);
                setNotificationLength(updatedNotifications.length);
            }
            else {
                toast.warn(data.message, {
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
            toast.error('Error updating image', {
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

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setShow(false);
            let response;
            if (imageURL) {
                const file = e.target.image.files[0];
                const base64String = await imageToBase64(file);

                response = await axios.post(`${backendURL}/post/newPost`,
                    { heading, body, base64String },
                    {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`
                        }
                    }
                )
            }
            else {
                response = await axios.post(`${backendURL}/post/newPost`,
                    { heading, body },
                    {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`
                        }
                    }
                )
            }
            const data = response.data;
            setImageURL('');


            if (data.status === 'success') {
                toast.success('Posted successfully', {
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
                navigate(`/post/${data.postID}`);
            }
            else {
                if (data.message === 'Not authorised') {
                    toast.warn('Login to post', {
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

                toast.error('Error posting', {
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
                console.log(data.message)
                navigate('/');
            }

        }
        catch (e) {
            toast.success('Posted successfully', {
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
            if (globalUsername === 'ACCOUNT_DEFAULT') return;

            try {
                const response = await axios.get(`${backendURL}/user/${globalUsername}`,
                    {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`
                        }
                    }
                )
                const data = response.data;

                if (data.status === 'success') {
                    setAvatarURL(data.userData.avatarString);
                    setNotificationsArray(data.userData.notifications);
                    setNotificationLength(data.userData.notifications.length);
                    setUserID(data.userData._id);
                }
                else {
                    console.log('Error fetching user : ' + data.message);
                    navigate('/');
                }
            }
            catch (e) {
                console.log('Error : ' + e);
            }
        }

        fetchUser();
    }, [globalUsername, navigate])


    return (
        <>
            <nav>
                <Link className='link text-black' to={'/'}>
                    <h1 >OFFBEAT</h1>
                </Link>

                {/* Navbar profile */}
                {globalIsLoggedIn
                    ?
                    <div className="topRight">
                        {/* Create Post button */}
                        <button onClick={handleShow} className='btn profileButton' data-toggle="modal" data-target="#newPostModal">
                            <FontAwesomeIcon className='plusIcon' icon={faPlus} />
                            <h4 id='createText' > Create </h4>
                        </button>

                        {/* Notifications */}
                        
                        {/* Notification button */}
                        <div style={{ position: 'relative' }} >

                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className='btn topRight'
                                style={{
                                    height: '100%',
                                    border: '2px solid black',
                                    borderRadius: '15px'
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faBell}
                                    style={{ scale: '140%' }}
                                />
                                {notificationLength > 0 && (
                                    <span
                                        style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-5px',
                                            backgroundColor: 'red',
                                            color: 'white',
                                            borderRadius: '50%',
                                            padding: '3px 6px',
                                            fontSize: '12px',
                                        }}
                                    >
                                        {notificationLength}
                                    </span>
                                )}
                            </button>

                            {/* Notification dropdown */}
                            {showNotifications && (
                                <div
                                    style={{
                                        scale: '130%',
                                        position: 'absolute',
                                        top: '5rem',
                                        transform: 'translateX(-50%)',
                                        backgroundColor: 'white',
                                        border: '1px solid #ddd',
                                        borderRadius: '5px',
                                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                                        marginTop: '10px',
                                        zIndex: 10,
                                        padding: '0.8rem',
                                        width: '15rem',
                                    }}
                                >
                                    {notificationLength > 0 ? (
                                        notificationsArray.map((notification, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    padding: '0.5rem 0.1rem',
                                                    borderBottom: index !== notificationLength - 1 ? '1px solid #aaa' : 'none',
                                                    fontSize: '0.8rem',
                                                    color: '#333',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <a className='link' style={{color: 'black'}} href={notification.action_url}> {notification.message} </a>
                                                <FontAwesomeIcon style={{scale: '150%', cursor: 'pointer'}} icon={faCheck} onClick={() => {handleMarkRead(notification._id)}} />  

                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ fontSize: '14px', color: '#888' }}> No notifications </div>
                                    )}
                                </div>
                            )}
                        </div>



                        {/* go to user page */}
                        <Link className='link' to={`/user/${globalUsername}`}>
                            <button className='btn profileButton'>
                                {avatarURL
                                    ?
                                    <img className='navbarImage' src={`data:image/jpeg;base64,${avatarURL}`} alt="profile avatar" />
                                    :
                                    <FontAwesomeIcon className='navbarIcon' icon={faUser} />
                                }
                                <h4>{globalUsername}</h4>
                            </button>
                        </Link>
                    </div>
                    :
                    <div className='topRight'>
                        <Link className='link' to={'/register'}>
                            <button className='btn profileButton'> <h4> Login / Signup </h4> </button>
                        </Link>
                    </div>
                }

            </nav >


            {/* Create Post modal */}
            <Modal className='newPostOverlay' id='newPostModal' show={show} onHide={() => { setShow(false); setImageURL('') }}>
                <form className="row g-3 needs-validation" onSubmit={handleSubmit}>
                    <Modal.Header> <h4>Whats on your mind...</h4> </Modal.Header>

                    <Modal.Body className='m-0'>
                        <div className='formInputs'>
                            <div className="mb-2">
                                <input autoComplete="true" name="heading" type="text" placeholder="Title" className="form-control" id="validationCustomUsername" aria-describedby="inputGroupPrepend" required
                                    onChange={(e) => setHeading(e.target.value)} />
                                <div className="invalid-feedback">
                                    Give a title...
                                </div>
                            </div>

                            <div className="mb-2">
                                <textarea rows='3' name="body" className="form-control" id="validationTextarea" placeholder="Body" required
                                    onChange={(e) => setBody(e.target.value)}
                                ></textarea>
                                <div className="invalid-feedback">
                                    Enter something in body...
                                </div>
                            </div>
                        </div>

                        <input autoComplete="true" style={{ display: 'none' }} type="file" name="image" id="image" accept=".png, .jpg" onChange={handleImageChange} />

                        {imageURL
                            ? <>
                                <FontAwesomeIcon onClick={() => setImageURL('')}
                                    style={{
                                        position: 'relative',
                                        left: '0px',
                                        top: '0px',
                                        scale: '120%',
                                        cursor: 'pointer',
                                        color: 'black',
                                    }} icon={faXmark} />
                                <label
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                    }}
                                    htmlFor="image">
                                    <img
                                        style={{
                                            maxWidth: '80%',
                                            maxHeight: '15rem',
                                            borderRadius: '15px',
                                        }} src={imageURL} alt="post image" />
                                </label>
                            </>
                            : <label
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '2rem',
                                    cursor: 'pointer',
                                }}

                                htmlFor="image"><FontAwesomeIcon
                                    style={{
                                        scale: '180%',
                                        marginBottom: '0.3rem',
                                    }} icon={faImage} /> <h5>Upload Image</h5>
                            </label>
                        }


                    </Modal.Body>
                    <Modal.Footer className='m-0'>
                        <Button variant="light" onClick={() => { setShow(false); setImageURL('') }}>
                            Close
                        </Button>
                        <Button variant="warning" type='submit'>
                            Post
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal >

        </>
    );
}