import axios from 'axios'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export function Admin() {
    const [key, setKey] = useState('');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [showPanel, setShowPanel] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await axios.post(`https://offbeat-qm21.onrender.com/adminAuth`,
                { username, password },
            )
            const data = response.data;


            if (data.status === 'success') {
                setShowPanel(true);
                toast.success(data.message, {
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
            }
            else {
                toast.error(data.message, {
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
            }
        }
        catch (err) {
            console.log(err.message);
            toast.error('Error logging in as admin', {
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
        }
    }

    async function handleDelete(e) {
        e.preventDefault();

        try {
            const response = await axios.post('https://offbeat-qm21.onrender.com/dropDB',
                { key },
            );
            const data = response.data;

            if (data.status === 'success') {
                toast.success(data.message, {
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
            }
            else {
                toast.error(data.message, {
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
            }

            navigate('/');
        }
        catch (err) {
            console.log(err.message);
            toast.error('Error', {
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
        }
    }

    return (
        <div className="Admin">
            <form>
                <label htmlFor="username"> Username </label> &emsp;
                <input type="text" id="username" name="username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <br /> <br />

                <label htmlFor="password"> Password </label> &emsp;
                <input type="text" id="password" name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <br /> <br />

                <input type="submit" value="Submit" onClick={handleSubmit} />
            </form>

            <hr />

            {
                showPanel
                &&
                <div className="AdminPanel">
                    <form>
                        <h2>Delete Database</h2>
                        <label htmlFor="key"> Key </label> &emsp;
                        
                        <input type="text" name="key" id="key"
                            onChange={(e) => setKey(e.target.value)}
                            required
                        />

                        <br /><br />
                        <input className="btn btn-danger" type="submit" value="Delete" onClick={handleDelete} />
                    </form>

                </div>
            }
        </div>
    );
}