import axios from "axios";
import { Bounce, toast } from 'react-toastify';

export async function handleSavePost(postID, setSaved) {
    try {
        const response = await axios.get(`https://offbeat-qm21.onrender.com/user/savePost/${postID}`,
            { withCredentials: true },
        )
        const data = response.data;

        if (data.status === 'success') {
            toast.success('Added to saved posts', {
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
            setSaved(true);
            console.log('Saved Post');
        }
        else {
            if (data.message === 'no token found') {
                toast.warn('Login to save post', {
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
                toast.error('Error adding to saved posts', {
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
        toast.error('Error adding to saved posts', {
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
        console.log('Error saving post : ' + e);
    }
}