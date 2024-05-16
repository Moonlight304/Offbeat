import axios from 'axios'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isLoggedInState } from '../atoms';
import { useRecoilState } from 'recoil';
import { PostCard } from './PostCard';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../index.css'

export function Home() {
    const [allPosts, setAllPosts] = useState([]);
    const [postCount, setPostCount] = useState(0);
    const [globalIsLoggedIn, setGlobalIsLoggedIn] = useRecoilState(isLoggedInState);

    useEffect(() => {
        try {
            async function getPosts() {
                const response = await axios.get('http://localhost:3000/');
                const data = response.data;

                if (data.status === 'success') {
                    setAllPosts(data.allPosts);
                    setPostCount(data.count);
                }
                else {
                    toast.error('Error loading posts', {
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
                    setAllPosts(['ERROR']);
                    setPostCount(0);
                }
            }
            
            getPosts();

        }
        catch (e) {
            toast.error('Error loading posts', {
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

    }, []);

    return (
        <div className='Home'>
            {postCount
                ? allPosts.map((post, index) => {
                    return <PostCard key={index} postID={post._id} />
                })
                :
                <h1> No Posts </h1>
            }
        </div>
    );
}