import axios from "axios";
import { Bounce, toast } from 'react-toastify';
import { toastConfig } from '../components/toastConfig';

const backendURL = import.meta.env.VITE_backendURL;

export async function getPost(postID, setPost, setUsername, setlikeCount) {
    try {
        const response = await axios.get(`${backendURL}/post/${postID}`);
        const data = response.data;
        
        setPost(data.post);
        setUsername(data.post.username);
        setlikeCount(data.post.likeCount);
    }
    catch (e) {
        toast.error('Error fetching post', toastConfig);
        console.log('Error fetching post : ' + e);
    }
}