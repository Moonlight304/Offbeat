import axios from 'axios';
import { Link } from "react-router-dom";
import { usernameState, isLoggedInState } from '../atoms'
import { useRecoilState } from "recoil";
import default_avatar from '../assets/default_avatar.jpg'
import { useEffect, useState } from "react";

export function Navbar() {
    const [globalUsername, setGlobalUsername] = useRecoilState(usernameState);
    const [globalIsLoggedIn, setGlobalIsLoggedIn] = useRecoilState(isLoggedInState);
    const [imageURL, setImageURL] = useState('');

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await axios.get(`http://localhost:3000/user/${globalUsername}`,
                    { withCredentials: true },
                )
                const data = response.data;

                if (data.status === 'success') {
                    setImageURL(data.userData.avatarString);
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
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link to={'/'}> <h1> Offbeat </h1> </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        {globalIsLoggedIn && <li>
                            <Link className="nav-link active" aria-current="page" to={'/post/newPost'}> Add </Link>
                        </li>}

                        {!globalIsLoggedIn && <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to={'/login'}> Login </Link>
                        </li>}

                        {!globalIsLoggedIn && <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to={'/signup'}> Signup </Link>
                        </li>}


                        {globalIsLoggedIn && <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to={'/logout'}> Logout </Link>
                        </li>}
                    </ul>
                </div>
            </div>


            {/* Navbar profile */}
            {globalIsLoggedIn
                ? <Link to={`/user/${globalUsername}`}> {imageURL ? <img src={`data:image/jpeg;base64,${imageURL}`} alt="profile avatar" /> : globalUsername} </Link>
                : <img src={default_avatar} alt="default_avatar" />
            }

        </nav>
    );
}