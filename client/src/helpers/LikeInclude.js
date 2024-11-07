import axios from "axios";
import { Bounce, toast } from 'react-toastify';
import { toastConfig } from '../components/toastConfig';

const backendURL = import.meta.env.VITE_backendURL;

export async function getLikeInclude(postID, setLiked) {
    try {
        const response = await axios.get(`${backendURL}/post/${postID}/checkLiked`,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`
                }
            }
        )
        const data = response.data;

        if (data.status === 'success')
            setLiked(JSON.parse(data.message));
        else {
            if (data.message === 'Not authorised') return;

            toast.error(`${data.message}`, toastConfig);
            console.log('Error : ' + data.message);
        }
    }
    catch (e) {
        toast.error(`${e.message}`, toastConfig);
        console.log('Error : ' + e);
    }
}