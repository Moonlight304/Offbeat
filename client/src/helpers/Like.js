import axios from 'axios';
import { Bounce, toast } from 'react-toastify';

export async function handleLike(postID, setlikeCount, setLiked) {
    try {
        const response = await axios.get(`https://offbeat-qm21.onrender.com/post/like/${postID}`,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`
                }
            }
        )
        const data = response.data;

        if (data.status === 'success') {
            toast.success('Liked Post', {
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
            console.log('Liked post');
            setlikeCount(data.newLikeCount);
            setLiked(true);
        }
        else {
            if (data.message === 'Not authorised') {
                toast.warn('Login to like post', {
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
            else {
                toast.error('Error liking post', {
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
    }
    catch (e) {
        toast.error('Error liking post', {
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
        console.log('Error liking post : ' + e);
    }
}