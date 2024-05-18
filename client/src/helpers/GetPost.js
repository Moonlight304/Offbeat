import axios from "axios";
import { Bounce, toast } from 'react-toastify';

export async function getPost(postID, setPost, setUsername, setlikeCount) {
    try {
        const response = await axios.get(`http://localhost:3000/post/${postID}`);
        const data = response.data;
        
        setPost(data.post);
        setUsername(data.post.username);
        setlikeCount(data.post.likeCount);
    }
    catch (e) {
        toast.error('Error fetching post', {
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
        console.log('Error fetching post : ' + e);
    }
}