import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import default_avatar from '../assets/default_avatar.jpg';
import { usernameState } from '../atoms';
import { useRecoilState } from "recoil";

export function EditUser() {
    const { username } = useParams();
    const [userData, setUserData] = useState({});
    const [imageURL, setImageURL] = useState('');
    const [globalUsername, setGlobalUsername] = useRecoilState(usernameState);
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [gender, setGender] = useState('none');
    const navigate = useNavigate();

    function imageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = error => {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    }

    async function handleAvatarChange(e) {
        e.preventDefault();

        // console.log(e.target.files[0]);

        const file = e.target.files[0];
        const base64String = await imageToBase64(file);
        try {
            const response = await axios.post(`http://localhost:3000/user/uploadAvatar`,
                { base64String },
                { withCredentials: true },
            )
            const data = response.data;
            console.log(data);

            if (data.status === 'success') {
                const url = URL.createObjectURL(file);
                setImageURL(url);
            }
            else
                navigate(`/user/${username}`);

            window.location.reload();
        }
        catch (e) {
            console.log('Error : ' + e);
        }
    }

    async function handleAvatarDelete() {
        try {
            const response = await axios.get(`http://localhost:3000/user/deleteAvatar/${username}`,
                { withCredentials: true },
            )
            const data = response.data;

            if (data.status === 'success')
                console.log('avatar deleted successfully');
            else
                console.log('avatar deletion failed : ' + data.message);

            console.log(data.user);

            // navigate(`/`);
            window.location.reload();
        }
        catch (e) {
            console.log('Error : ' + e);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:3000/user/editUser/${username}`,
                { email, bio, gender },
                { withCredentials: true },
            )
            const data = response.data;

            if (data.status === 'success')
                console.log('Updated profile');
            else
                console.log('Error : ' + data.message);

            navigate(`/user/${username}`);
        }
        catch (e) {
            console.log('Error : ' + e);
        }
    }

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await axios.get(`http://localhost:3000/user/${username}`,
                    { withCredentials: true },
                )
                const data = response.data;

                if (data.status === 'success') {
                    setUserData(data.userData);
                    setImageURL(data.userData.avatarString);
                    setEmail(data.userData.email || '');
                    setBio(data.userData.bio || '');
                    setGender(data.userData.gender || '');
                }
                else {
                    console.log('error fetching user : ' + data.message);
                    navigate('/');
                }
            }
            catch (e) {
                console.log('Error : ' + e);
            }
        }

        fetchUser();
    }, [])

    return (
        <>
            {globalUsername === username && <input type="file" name="avatar" id="avatar" accept=".png, .jpg" onChange={handleAvatarChange} />}

            {imageURL
                ?
                <>
                    <label htmlFor="avatar"> <img src={`data:image/jpeg;base64,${imageURL}`} alt="uploaded image" /> </label>
                    <button onClick={handleAvatarDelete}>Delete Avatar</button>
                </>
                : <label htmlFor="avatar"> <img src={default_avatar} alt="default_avatar" /> </label>
            }

            <form onSubmit={handleSubmit}>
                <label htmlFor="email"><h3> Edit email </h3></label>
                <input type="email" name="email" id="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="bio"><h3> Edit bio </h3></label>
                <input type="text" name="bio" id="bio" value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />

                <label htmlFor="gender"> <h3> Gender </h3> </label>
                <select name="gender" id="gender" value={gender}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <option value="none"> Dont say </option>
                    <option value="Male"> Male </option>
                    <option value="Female"> Female </option>
                </select>

                <input type="submit" value="Save" />
            </form>
        </>
    );
}