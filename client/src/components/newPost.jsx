import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { imageToBase64 } from '../helpers/imageToBase64';
import 'bootstrap/dist/css/bootstrap.min.css';


export function NewPost() {
    const [heading, setHeading] = useState('');
    const [body, setBody] = useState('');
    const navigate = useNavigate();
    const [imageURL, setImageURL] = useState(null);

    async function handleImageChange(e) {
        e.preventDefault();

        console.log(e.target.files[0]);

        const file = e.target.files[0];

        const url = URL.createObjectURL(file);
        setImageURL(url);
    }

    async function handleSubmit(e) {
        e.preventDefault();


        let response;
        if (imageURL) {
            const file = e.target.image.files[0];
            const base64String = await imageToBase64(file);

            response = await axios.post('https://offbeat-qm21.onrender.com/post/newPost',
                { heading, body, base64String },
                { withCredentials: true },
            )
        }
        else {
            response = await axios.post('https://offbeat-qm21.onrender.com/post/newPost',
                { heading, body },
                { withCredentials: true },
            )
        }
        const data = response.data;

        if (data.status === 'success')
            navigate(`/post/${data.postID}`);
        else
            navigate('/');
    }

    

    return (
        <>
            {/* <form className="row g-3 needs-validation" onSubmit={handleSubmit}>
                <div className="col-md-4">
                    <div className="input-group has-validation mb-4">
                        <input name="heading" type="text" placeholder="Title" className="form-control" id="validationCustomUsername" aria-describedby="inputGroupPrepend" required
                            onChange={(e) => setHeading(e.target.value)} />
                        <div className="invalid-feedback">
                            Give a title...
                        </div>
                    </div>

                    <div className="mb-3">
                        <textarea name="body" className="form-control" id="validationTextarea" placeholder="Body" required
                            onChange={(e) => setBody(e.target.value)}
                        ></textarea>
                        <div className="invalid-feedback">
                            Enter something in body...
                        </div>
                    </div>
                </div>

                <input type="file" name="image" id="image" accept=".png, .jpg" onChange={handleImageChange} />

                {imageURL && <img src={imageURL} alt="uploaded image" />}


                <div className="col-12">
                    <button className="btn btn-primary" type="submit"> Post </button>
                </div>
            </form> */}
        </>
    );
}