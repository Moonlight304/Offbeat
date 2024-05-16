import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usernameState, isLoggedInState } from '../atoms'
import { useRecoilState } from 'recoil';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../index.css'

export function Signup({ setWantLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [globalUsername, setGlobalUsername] = useRecoilState(usernameState);
    const [globalIsLoggedIn, setGlobalIsLoggedIn] = useRecoilState(isLoggedInState);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/signup',
                { username, password, confirmPassword },
                { withCredentials: true }
            );
            const data = response.data;
            console.log(data);

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
                setGlobalUsername(username);
                setGlobalIsLoggedIn(true);
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
                navigate('/signup');
            }
        }
        catch (e) {
            toast.error('Signup failed', {
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
                <h1 id='signupText'>Sign up</h1>

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

                <div className='d-flex flex-column align-items-start pe-5 gap-2'>
                    <label htmlFor="confirmPassword"> <h4> Confirm password </h4> </label>
                    <input placeholder='Confirm password' type="text" name="confirmPassword" id="confirmPassword"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <h6> Already have an account? <Link onClick={() => setWantLogin(true)}> Login </Link> </h6>
                <input className='btn btn-warning' type="submit" value="Sign up" />
            </form>
        </div>

    );
}