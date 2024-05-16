import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usernameState, isLoggedInState } from '../atoms'
import { useRecoilState } from 'recoil';
import axios from 'axios';

export function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [globalUsername, setGlobalUsername] = useRecoilState(usernameState);
    const [globalIsLoggedIn, setGlobalIsLoggedIn] = useRecoilState(isLoggedInState);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const response = await axios.post('http://localhost:3000/signup',
            { username, password },
            { withCredentials: true }
        );
        const data = response.data;
        console.log(data);

        if (data.status === 'success') {
            setGlobalUsername(username);
            setGlobalIsLoggedIn(true);
            
            navigate('/');
        }
        else
            navigate('/signup');
    }

    return (
        <>
            <h1>Sign up</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="username"> Enter username : </label>
                <input type="text" name="username" id="username" required onChange={
                    (e) => setUsername(e.target.value)
                } />

                <label htmlFor="password"> Enter password : </label>
                <input type="text" name="password" id="password" required onChange={
                    (e) => setPassword(e.target.value)
                } />

                <input type="submit" value="Sign up" />
            </form>
        </>
    );
}