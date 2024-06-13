import axios from 'axios'
import { useEffect, useState } from 'react';
import { PostCard } from './PostCard';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
import '../index.css'

export function Home() {
    const [allPosts, setAllPosts] = useState([]);
    const [postCount, setPostCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getPosts() {
            try {
                const response = await axios.get('https://offbeat-qm21.onrender.com/');
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