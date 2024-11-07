import axios from "axios";
import { Bounce, toast } from 'react-toastify';
import { toastConfig } from '../components/toastConfig';

const backendURL = import.meta.env.VITE_backendURL;

export async function handleDeleteSavePost(postID, setSaved) {
    try {
        const response = await axios.get(`${backendURL}/user/deleteSavedPost/${postID}`,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`
                }
            }
        )
        const data = response.data;

        if (data.status === 'success') {
            toast.success('Removed from saved posts', toastConfig);
            setSaved(false);
            console.log('Removed post from saved items');
        }
        else {
            toast.error('Error removing from saved posts', toastConfig);
            console.log('Error : ' + data.message);
        }
    }
    catch (e) {
        toast.error('Error removing from saved posts', toastConfig);
        console.log('Error saving post : ' + e);
    }
}