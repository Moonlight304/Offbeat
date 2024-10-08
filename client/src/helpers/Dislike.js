import axios from 'axios';
import { Bounce, toast } from 'react-toastify';
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
            toast.success('Disliked post', {
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
            setlikeCount(data.newLikeCount);
            setLiked(false);
            console.log('Disliked post');
        }
        else {
            toast.error('Error disliking post', {
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
            console.log('Error : ' + data.message);
        }
    }
    catch (e) {
        toast.error('Error disliking post', {
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
        console.log('Error disliking post : ' + e);
    }
}