import axios from "axios";
import { Bounce, toast } from 'react-toastify';
import { toastConfig } from '../components/toastConfig';

const backendURL = import.meta.env.VITE_backendURL;

export async function fetchUser(operation, username, setAvatarURL, setUserData, setImageURL, setFollowersCount, setFollowingCount) {
    try {
        if (username === '') return;

        const response = await axios.get(`${backendURL}/user/${username}`,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`
                }
            },
        )
        const data = response.data;
        const userData = data.userData;

        if (data.status === 'success') {
            if (operation === 'USER') {
                setUserData(userData);
                setImageURL(userData.avatarString);
                setFollowersCount(userData.followersCount);
                setFollowingCount(userData.followingCount);
            }
            else
                setAvatarURL(data.userData.avatarString);
        }
        else {
            // toast.error(`${data.message}`, toastConfig);
            console.log('Error : ' + data.message);
            if (operation === 'POST')
                setAvatarURL('');
        }
    }
    catch (e) {
        toast.error(`${e.message}`, toastConfig);
        console.log('Error : ' + e);
    }
}