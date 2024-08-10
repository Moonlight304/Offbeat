import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Logout } from './components/Logout';
import { Post } from './components/Post';
import { EditPost } from './components/EditPost';
import { User } from './components/User'
import { EditUser } from './components/EditUser';
import { NotFound } from './components/NotFound';
import { Register } from './components/Register';

function App() {

    return (
        <div className='App'>
            <BrowserRouter>
                <Navbar />

                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/logout' element={<Logout />} />
                    <Route path='/post/:postID' element={<Post />} />
                    <Route path='/post/editPost/:postID' element={<EditPost />} />
                    <Route path='/user/:username' element={<User />} />
                    <Route path='/user/editUser/:username' element={<EditUser />} />

                    <Route path='*' element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App
