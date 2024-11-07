import axios from 'axios'
const backendURL = import.meta.env.VITE_backendURL;
import { useEffect, useState } from 'react';
import { Bounce, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { PostCard } from './PostCard';
import { toastConfig } from './toastConfig';

import '../index.css'

export function Home() {
    const [allPosts, setAllPosts] = useState([]);
    const [postCount, setPostCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getPosts() {
            try {
                const response = await axios.get(`${backendURL}/`);
                const data = response.data;

                if (data.status === 'success') {
                    setAllPosts(data.allPosts);
                    setPostCount(data.count);
                }
                else {
                    console.log(data.message);
                    toast.error('Error loading posts', toastConfig);
                    setAllPosts(['ERROR']);
                    setPostCount(0);
                }
            }
            catch (e) {
                console.log(e.message);
                toast.error('Error loading posts', toastConfig);
                console.log('Error : ' + e);
            }
            finally {
                setIsLoading(false);
            }
        }


        getPosts();
    }, []);

    if (isLoading)
        return (
            <div className='d-flex justify-content-center align-items-center'
                style={{
                    height: '10rem',
                }}
            >

                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        )

    return (
        <div className='Home'>
            {postCount
                ? allPosts.map((post, index) => {
                    return <PostCard key={index} postID={post._id} />
                })
                :
                <div className='d-flex flex-column justify-content-center align-items-center mt-5'>
                    <h1> No Posts  </h1>
                    <img style={{
                        width: '20rem',
                        height: 'auto',
                    }} src="/assets/cartoonBox.jpg" alt="Box" />
                </div>
            }
        </div>
    );
}