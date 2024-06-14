import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usernameState, isLoggedInState } from '../atoms'
import { useRecoilState } from 'recoil';
import { handleSubmit } from '../helpers/Auth';
import 'react-toastify/dist/ReactToastify.css';

import '../index.css'

export function Login({ setWantLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [globalUsername, setGlobalUsername] = useRecoilState(usernameState);
    const [globalIsLoggedIn, setGlobalIsLoggedIn] = useRecoilState(isLoggedInState);
    const navigate = useNavigate();

    return (
        <div className='d-flex justify-content-center align-items-center'>
            <form className='register' onSubmit={(e) => {
                e.preventDefault();
                handleSubmit('login', username, password, null, setGlobalIsLoggedIn, setGlobalUsername, navigate)
            }}>

                <div className='d-flex justify-content-between align-items-start'> <h1 id='signupText'>Hi 👋</h1> </div>
                <h2 id='loginText'> Welcome back! </h2>

                <div className='d-flex flex-column align-items-start pe-3 ps-3 gap-2'>
                    <label htmlFor="username"> <h4> Username </h4> </label>
                    <input autoComplete="true" className='ps-3' placeholder='Username' type="text" name="username" id="username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className='d-flex flex-column align-items-start pe-3 ps-3 gap-2'>
                    <label htmlFor="password"> <h4> Password </h4> </label>
                    <input autoComplete="true" className='ps-3' placeholder='Password' type="password" name="password" id="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <h6> Dont have an account? <Link onClick={() => setWantLogin(false)}> Signup </Link> </h6>
                <input autoComplete="true" className='btn btn-warning' type="submit" value="Login" />
            </form>
        </div>
    );
}   