import axios from "axios";
const backendURL = import.meta.env.VITE_backendURL;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button, Spinner } from 'react-bootstrap';

import { imageToBase64 } from '../helpers/imageToBase64';

export function EditPost() {
    const { postID } = useParams();
    const [post, setPost] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const [newHeading, setNewHeading] = useState('');
    const [newBody, setNewBody] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageURL, setImageURL] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function getPost() {
            try {
                const response = await axios.get(`${backendURL}/post/${postID}`);
                const data = response.data;

                setPost(data.post);
                setNewHeading(data.post.heading);
                setNewBody(data.post.body);
                setImageURL(data.post.base64String);
                setIsLoading(false);
            } catch (e) {
                toast.error('Error fetching post', {
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
                console.log('Error fetching post: ' + e);
                setIsLoading(false);
            }
        }

        getPost();
    }, [postID]);

    function handleImageChange(e) {
        e.preventDefault();

        try {
            const file = e.target.files[0];
            setImageFile(file);

            const url = URL.createObjectURL(file);
            setImageURL(url);
        } catch (e) {
            console.log('Error updating image');
        }
    }

    async function handleEditPost(e) {
        e.preventDefault();

        try {
            let newBase64String = '';

            if (imageFile)
                newBase64String = await imageToBase64(imageFile);
            else
                newBase64String = imageURL;


            const response = await axios.post(`${backendURL}/post/editPost/${postID}`,
                { newHeading, newBody, newBase64String },
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`
                    }
                }
            );
            const data = response.data;

            if (data.status === 'success') {
                toast.success('Edited post', {
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
                navigate(`/post/${postID}`);
            } else {
                console.log('Error updating post: ' + data.message);
                toast.error('Error updating post', {
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
        } catch (e) {
            console.log(e.message);
            toast.error('Error updating post', {
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

    if (isLoading) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{ height: '10rem' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <>
            <form className="row g-3 needs-validation" onSubmit={handleEditPost}>
                <h1>Edit Post</h1>

                <div className='formInputs'>
                    <div className="mb-2">
                        <input autoComplete="true" name="newHeading" type="text" placeholder="Title" className="form-control" id="validationCustomUsername" aria-describedby="inputGroupPrepend" required
                            onChange={(e) => setNewHeading(e.target.value)}
                            value={newHeading}
                        />
                        <div className="invalid-feedback">
                            Give a title...
                        </div>
                    </div>

                    <div className="mb-2">
                        <textarea rows='3' name="newBody" className="form-control" id="validationTextarea" placeholder="Body" required
                            onChange={(e) => setNewBody(e.target.value)}
                            value={newBody}
                        ></textarea>
                        <div className="invalid-feedback">
                            Enter something in body...
                        </div>
                    </div>
                </div>

                <input autoComplete="true" style={{ display: 'none' }} type="file" name="image" id="image" accept=".png, .jpg" onChange={handleImageChange} />

                {imageURL ? (
                    <>
                        <FontAwesomeIcon onClick={() => setImageURL('')}
                            style={{
                                position: 'relative',
                                left: '300px',
                                top: '0px',
                                scale: '120%',
                                cursor: 'pointer',
                                color: 'black',
                            }} icon={faXmark}
                        />

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
                ) : (
                    <label
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '2rem',
                            cursor: 'pointer',
                        }}
                        htmlFor="image">
                        <FontAwesomeIcon
                            style={{
                                scale: '180%',
                                marginBottom: '0.3rem',
                            }} icon={faImage} /> <h5>Upload Image</h5>
                    </label>
                )}

                <Button style={{ width: '5rem' }} variant="warning" type='submit'>
                    Post
                </Button>
            </form>
        </>
    );
}
