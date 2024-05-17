import axios from "axios";
import { toast, Bounce } from "react-toastify";

export async function handleSubmit(operation, username, password, confirmPassword, setGlobalIsLoggedIn, setGlobalUsername, navigate) {

    try {
        let response;
        if (operation === 'login') {
            response = await axios.post('https://offbeat-qm21.onrender.com/login',
                { username, password },
                { withCredentials: true }
            );
        } else if (operation === 'signup') {
            response = await axios.post('https://offbeat-qm21.onrender.com/signup',
                { username, password, confirmPassword },
                { withCredentials: true }
            );
        }
        else {
            response = await axios.get('https://offbeat-qm21.onrender.com/logout',
                { withCredentials: true }
            )
        }
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
            if (operation === 'logout')
                setGlobalIsLoggedIn(false);
            else
                setGlobalIsLoggedIn(true);
            navigate('/');
        } else {
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
