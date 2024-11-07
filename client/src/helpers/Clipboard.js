import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastConfig } from '../components/toastConfig';


export function handleClipboard(postID) {
    if (!navigator.clipboard) {
        console.log('Clipboard API not supported');
        toast.error('Clipboard API not supported', toastConfig);
        return;
    }

    try {
        if (!postID) {
            console.log('Post ID is not defined');
            toast.error('No post found', toastConfig);
            return;
        }
        const copyURL = `${window.location.origin}/post/${postID}`;
        navigator.clipboard.writeText(copyURL);
        console.log('Copied to clipboard');
        toast.success('Copied to clipboard!', toastConfig);
    }
    catch (e) {
        console.log('Error copying to clipboard : ' + e);
        toast.error('Error copying to clipboard', toastConfig);
    }
}