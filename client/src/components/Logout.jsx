import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usernameState, isLoggedInState } from '../atoms'
import { useRecoilState } from 'recoil';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Logout() {
    const [globalUsername, setGlobalUsername] = useRecoilState(usernameState);
    const [globalIsLoggedIn, setGlobalIsLoggedIn] = useRecoilState(isLoggedInState);
    const navigate = useNavigate();

    useEffect(() => {
        async function handleLogout() {
            try {
                const response = await axios.get('http://localhost:3000/logout',
                    { withCredentials: true }
                )
                const data = response.data;

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
                    setGlobalUsername('ACCOUNT_DEFAULT');
                    setGlobalIsLoggedIn(false);
                }
                else {
                    console.log('Logout failed : ' + data.message);
                }
                
                navigate('/');
            }
            catch (e) {
                toast.error('Logout failed', {
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

        handleLogout();
    }, []);

    return (
        <>
        </>
    );
}