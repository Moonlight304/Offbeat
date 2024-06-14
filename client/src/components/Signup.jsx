import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usernameState, isLoggedInState } from '../atoms'
import { useRecoilState } from 'recoil';
import { handleSubmit } from '../helpers/Auth';

import 'react-toastify/dist/ReactToastify.css';
import '../index.css'

export function Signup({ setWantLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [globalUsername, setGlobalUsername] = useRecoilState(usernameState);
    const [globalIsLoggedIn, setGlobalIsLoggedIn] = useRecoilState(isLoggedInState);
    const navigate = useNavigate();

    return (
        <div className='d-flex justify-content-center align-items-center'>

            <form className='register' onSubmit={(e) => {
                e.preventDefault();
                handleSubmit('signup', username, password, confirmPassword, setGlobalIsLoggedIn, setGlobalUsername, navigate)
            }}>
                <h1 id='signupText'>Sign up</h1>

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

                <div className='d-flex flex-column align-items-start pe-3 ps-3 gap-2'>
                    <label htmlFor="confirmPassword"> <h4> Confirm password </h4> </label>
                    <input autoComplete="true" className='ps-3' placeholder='Confirm password' type="password" name="confirmPassword" id="confirmPassword"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <h6> Already have an account? <Link onClick={() => setWantLogin(true)}> Login </Link> </h6>
                <input className='btn btn-warning' type="submit" value="Sign up" />
            </form>
        </div>

    );
}