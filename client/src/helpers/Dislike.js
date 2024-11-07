import axios from 'axios';
import { Bounce, toast } from 'react-toastify';
import { toastConfig } from '../components/toastConfig';

const backendURL = import.meta.env.VITE_backendURL;

export async function handleDislike(postID, setlikeCount, setLiked) {
    try {
        const response = await axios.get(`${backendURL}/post/disLike/${postID}`,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`
                }
            }
        )
        const data = response.data;

        if (data.status === 'success') {
            toast.success('Disliked post', toastConfig);
            setlikeCount(data.newLikeCount);
            setLiked(false);
            console.log('Disliked post');
        }
        else {
            toast.error('Error disliking post', toastConfig);
            console.log('Error : ' + data.message);
        }
    }
    catch (e) {
        toast.error('Error disliking post', toastConfig);
        console.log('Error disliking post : ' + e);
    }
}