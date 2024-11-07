import axios from "axios";
import { Bounce, toast } from 'react-toastify';
import { toastConfig } from '../components/toastConfig';

const backendURL = import.meta.env.VITE_backendURL;

export async function handleSavePost(postID, setSaved) {
    try {
        const response = await axios.get(`${backendURL}/user/savePost/${postID}`,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`
                }
            }
        )
        const data = response.data;

        if (data.status === 'success') {
            toast.success('Added to saved posts', toastConfig);
            setSaved(true);
            console.log('Saved Post');
        }
        else {
            if (data.message === 'Not authorised') {
                toast.warn('Login to save post', toastConfig);
            }
            else {
                toast.error('Error adding to saved posts', toastConfig);
                console.log('Error : ' + data.message);
            }
        }
    }
    catch (e) {
        toast.error('Error adding to saved posts', toastConfig);
        console.log('Error saving post : ' + e);
    }
}