import { useState } from 'react';
import { Login } from './Login';
import { Signup } from './Signup';

export function Register() {
    const [wantLogin, setWantLogin] = useState(true);

    return (
        <>
            {wantLogin
                ? <Login setWantLogin={setWantLogin} />
                : <Signup setWantLogin={setWantLogin} />
            }
        </>
    );
}