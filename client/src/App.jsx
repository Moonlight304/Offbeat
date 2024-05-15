import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Signup } from './components/Signup';
import { Login } from './components/Login';
import { Logout } from './components/Logout';
import { Post } from './components/Post';
import { NewPost } from './components/newPost';
import { User } from './components/User'
import { EditUser } from './components/EditUser';

function App() {

    return (
        <div className='App'>
            <BrowserRouter>
                <Navbar />

                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/logout' element={<Logout />} />
                    <Route path='/post/:postID' element={<Post />} />
                    <Route path='/post/newPost' element={<NewPost />} />
                    <Route path='/user/:username' element={<User />} />
                    <Route path='/user/editUser/:username' element={<EditUser />} />    

                    {/* <Route path='' element={} /> */}
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
