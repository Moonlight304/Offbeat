import axios from 'axios'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isLoggedInState } from '../atoms';
import { useRecoilState } from 'recoil';
import { PostCard } from './PostCard';

export function Home() {
    const [allPosts, setAllPosts] = useState([]);
    const [postCount, setPostCount] = useState(0);
    const [globalIsLoggedIn, setGlobalIsLoggedIn] = useRecoilState(isLoggedInState);

    useEffect(() => {
        async function getPosts() {
            const response = await axios.get('http://localhost:3000/');
            const data = response.data;
            console.log(data);
            console.log('Global Login state : ' + globalIsLoggedIn);

            if (data.status === 'success') {
                setAllPosts(data.allPosts);
                setPostCount(data.count);
            }
            else {
                setAllPosts(['ERROR']);
                setPostCount(0);
            }
        }

        getPosts();
    }, []);

    return (
        <>
            {postCount
                ? allPosts.map((post, index) => {
                    return <PostCard key={index} postID={post._id} />
                })
                :
                <h1> No Posts </h1>
            }
        </>
    );
}