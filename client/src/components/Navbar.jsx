import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { usernameState, isLoggedInState } from '../atoms'
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { imageToBase64 } from '../helpers/imageToBase64';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { Modal, Button } from "react-bootstrap";
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../index.css'

export function Navbar() {
    const [globalUsername, setGlobalUsername] = useRecoilState(usernameState);
    const [globalIsLoggedIn, setGlobalIsLoggedIn] = useRecoilState(isLoggedInState);
    const [avatarURL, setAvatarURL] = useState('');
    const [show, setShow] = useState(false);
    const [heading, setHeading] = useState('');
    const [body, setBody] = useState('');
    const [imageURL, setImageURL] = useState(null);
    const navigate = useNavigate();
    const handleShow = () => setShow(true);

    async function handleImageChange(e) {
        e.preventDefault();

        try {
            console.log(e.target.files[0]);

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

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setShow(false);
            let response;
            if (imageURL) {
                const file = e.target.image.files[0];
                const base64String = await imageToBase64(file);

                response = await axios.post('http://localhost:3000/post/newPost',
                    { heading, body, base64String },
                    { withCredentials: true },
                )
            }
            else {
                response = await axios.post('http://localhost:3000/post/newPost',
                    { heading, body },
                    { withCredentials: true },
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
                const response = await axios.get(`http://localhost:3000/user/${globalUsername}`,
                    { withCredentials: true },
                )
                const data = response.data;

                if (data.status === 'success') {
                    setAvatarURL(data.userData.avatarString);
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
    }, [globalUsername, navigate])


    return (
        <>
            <nav>
                <Link className='link' to={'/'}> <h1> Offbeat </h1> </Link>

                {/* Navbar profile */}
                {globalIsLoggedIn
                    ?
                    <div className="topRight">
                        {/* Create Post button */}
                        <button onClick={handleShow} className='btn profileButton' data-toggle="modal" data-target="#newPostModal">
                            <FontAwesomeIcon className='plusIcon' icon={faPlus} />
                            <h4 id='createText' > Create </h4>
                        </button>

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
                                <input name="heading" type="text" placeholder="Title" className="form-control" id="validationCustomUsername" aria-describedby="inputGroupPrepend" required
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

                        <input style={{ display: 'none' }} type="file" name="image" id="image" accept=".png, .jpg" onChange={handleImageChange} />

                        {imageURL
                            ? <>
                                <FontAwesomeIcon onClick={() => setImageURL('')}
                                    style={{
                                        position: 'relative',
                                        right: '-440px',
                                        top: '30px',
                                        scale: '120%',
                                        cursor: 'pointer',
                                        color: 'white',
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