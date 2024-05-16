import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function handleClipboard(postID) {
    if (!navigator.clipboard) {
        console.log('Clipboard API not supported');
        toast.error('Clipboard API not supported', {
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
        return;
    }

    try {
        if (!postID) {
            console.log('Post ID is not defined');
            toast.error('No post found', {
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
            return;
        }
        const copyURL = `${window.location.origin}/post/${postID}`;
        navigator.clipboard.writeText(copyURL);
        console.log('Copied to clipboard');
        toast.success('Copied to clipboard!', {
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
    catch (e) {
        console.log('Error copying to clipboard : ' + e);
        toast.error('Error copying to clipboard', {
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
}