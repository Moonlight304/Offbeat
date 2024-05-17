import axios from 'axios';
import { Bounce, toast } from 'react-toastify';

export async function handleDislike(postID, setlikeCount, setLiked) {
    try {
        const response = await axios.get(`https://offbeat-qm21.onrender.com/post/disLike/${postID}`,
            { withCredentials: true },
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
            console.log('disliked post');
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
            console.log('ERROR : ' + data.message);
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
        console.log('Error during "dislike" operation : ' + e);
    }
}