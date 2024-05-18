import axios from "axios";
import { Bounce, toast } from 'react-toastify';

export async function handleDeleteSavePost(postID, setSaved) {
    try {
        const response = await axios.get(`http://localhost:3000/user/deleteSavedPost/${postID}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                }
            }
        )
        const data = response.data;

        if (data.status === 'success') {
            toast.success('Removed from saved posts', {
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
            setSaved(false);
            console.log('Removed post from saved items');
        }
        else {
            toast.error('Error removing from saved posts', {
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
        toast.error('Error removing from saved posts', {
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