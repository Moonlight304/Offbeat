import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usernameState, isLoggedInState } from '../atoms'
import { useRecoilState } from 'recoil';
import 'react-toastify/dist/ReactToastify.css';
import { handleSubmit } from '../helpers/Auth';

export function Logout() {
    const [globalUsername, setGlobalUsername] = useRecoilState(usernameState);
    const [globalIsLoggedIn, setGlobalIsLoggedIn] = useRecoilState(isLoggedInState);
    const navigate = useNavigate();

    useEffect(() => {
        handleSubmit('logout', 'ACCOUNT_DEFAULT', null, null, setGlobalIsLoggedIn, setGlobalUsername, navigate)
    }, []);

    return (<></>)
}