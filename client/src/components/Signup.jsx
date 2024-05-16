import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usernameState, isLoggedInState } from '../atoms'
import { useRecoilState } from 'recoil';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [globalUsername, setGlobalUsername] = useRecoilState(usernameState);
    const [globalIsLoggedIn, setGlobalIsLoggedIn] = useRecoilState(isLoggedInState);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/signup',
                { username, password },
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