import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usernameState, isLoggedInState } from '../atoms'
import { useRecoilState } from 'recoil';

export function Logout() {
    const [globalUsername, setGlobalUsername] = useRecoilState(usernameState);
    const [globalIsLoggedIn, setGlobalIsLoggedIn] = useRecoilState(isLoggedInState);
    const navigate = useNavigate();

    useEffect(() => {
        async function handleLogout() {
            const response = await axios.get('http://localhost:3000/logout',
                { withCredentials: true }
            )
            const data = response.data;

            if (data.status === 'success') {
                setGlobalUsername('ACCOUNT_DEFAULT');
                setGlobalIsLoggedIn(false);
            }
            else
                console.log('Logout failed : ' + data.message);

            navigate('/');
        }

        handleLogout();
    }, []);

    return (<></>);
}