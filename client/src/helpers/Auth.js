import axios from "axios";
import { toast, Bounce } from "react-toastify";
const backendURL = import.meta.env.VITE_backendURL;


export async function handleSubmit(operation, username, password, confirmPassword, setGlobalIsLoggedIn, setGlobalUsername, navigate) {

    try {
        let response;
        if (operation === 'login') {
            response = await axios.post(`${backendURL}/login`,
                { username, password },
            );
        } else if (operation === 'signup') {
            response = await axios.post(`${backendURL}/signup`,
                { username, password, confirmPassword },
            );
        }
        else {
            response = await axios.get(`${backendURL}/logout`,
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`
                    }
                }
            )
        }
        const data = response.data;
        // console.log(data);

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
            if (operation === 'logout') {
                setGlobalIsLoggedIn(false);
                sessionStorage.removeItem('jwt_token');
            }
            else {
                setGlobalIsLoggedIn(true);
                sessionStorage.setItem('jwt_token', data.jwt_token);
            }
            navigate('/');
        } else {
            console.log(data.message);
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
            navigate('/register');
        }
    } catch (e) {
        console.log(e.message);
        toast.error(`Error while ${operation}`, {
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
