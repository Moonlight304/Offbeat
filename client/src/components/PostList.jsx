import { PostCard } from "./PostCard";
import 'react-toastify/dist/ReactToastify.css';

export function PostList({ title, posts }) {
    return (
        <>
            {posts && posts.length > 0
                ?
                <>
                    <h2> {title} </h2>
                    {posts.map((postID, index) => (
                        <PostCard key={index} postID={postID} />
                    ))}
                </>
                : title === 'Posts' ? <h2> No Posts </h2> : <h2> No Saved Posts </h2>
            }

        </>
    );
}