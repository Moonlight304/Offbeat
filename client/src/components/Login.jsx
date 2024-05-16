import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usernameState, isLoggedInState } from '../atoms'
import { useRecoilState } from 'recoil';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../index.css'

export function Login({ setWantLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [globalUsername, setGlobalUsername] = useRecoilState(usernameState);
    const [globalIsLoggedIn, setGlobalIsLoggedIn] = useRecoilState(isLoggedInState);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/login',
                { username, password },
                { withCredentials: true }
            );
            const data = response.data;
            console.log(data);

            if (data.status === 'success') {
                setGlobalUsername(username);
                setGlobalIsLoggedIn(true);
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

                navigate('/');
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
                navigate('/login');
            }
        }
        catch (e) {
            toast.error('Error logging in', {
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

    return (
        <div className='d-flex justify-content-center align-items-center'>
            <form className='register' onSubmit={handleSubmit}>
                <div className='d-flex justify-content-between align-items-start'> <h1 id='signupText'>Hi 👋</h1> </div>
                <h2 id='loginText'> Welcome back! </h2>

                <div className='d-flex flex-column align-items-start pe-5 gap-2'>
                    <label htmlFor="username"> <h4> Username </h4> </label>
                    <input placeholder='Username' type="text" name="username" id="username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className='d-flex flex-column align-items-start pe-5 gap-2'>
                    <label htmlFor="password"> <h4> Password </h4> </label>
                    <input placeholder='Password' type="text" name="password" id="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <h6> Dont have an account? <Link onClick={() => setWantLogin(false)}> Signup </Link> </h6>
                <input className='btn btn-warning' type="submit" value="Login" />
            </form>
        </div>
    );
}   