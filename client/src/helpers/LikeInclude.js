import axios from "axios";
import { Bounce, toast } from 'react-toastify';

export async function getLikeInclude(postID, setLiked) {
    try {
        const response = await axios.get(`http://localhost:3000/post/${postID}/checkLiked`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                }
            }
        )
        const data = response.data;

        if (data.status === 'success')
            setLiked(JSON.parse(data.message));
        else {
            if (data.message === 'Not authorised') return;

            toast.error(`${data.message}`, {
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
        toast.error(`${e.message}`, {
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
        console.log('Error : ' + e);
    }
}