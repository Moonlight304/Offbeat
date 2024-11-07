import axios from 'axios';
import { Bounce, toast } from 'react-toastify';
import { toastConfig } from '../components/toastConfig';

const backendURL = import.meta.env.VITE_backendURL;

export async function handleLike(postID, setlikeCount, setLiked) {
    try {
        const response = await axios.get(`${backendURL}/post/like/${postID}`,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`
                }
            }
        )
        const data = response.data;

        if (data.status === 'success') {
            toast.success('Liked Post', toastConfig);
            console.log('Liked post');
            setlikeCount(data.newLikeCount);
            setLiked(true);
        }
        else {
            if (data.message === 'Not authorised') {
                toast.warn('Login to like post', toastConfig);
            }
            else {
                toast.error('Error liking post', toastConfig);
                console.log('Error : ' + data.message);
            }
        }
    }
    catch (e) {
        toast.error('Error liking post', toastConfig);
        console.log('Error liking post : ' + e);
    }
}