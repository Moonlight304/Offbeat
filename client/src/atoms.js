import { atom } from 'recoil';
import { jwtDecode } from 'jwt-decode';

function getKey() {
    try {
        const jwt_token = sessionStorage.getItem('jwt_token');
        if (!jwt_token) {
            return null;
        }
        const decodedObj = jwtDecode(jwt_token);
        return decodedObj.username;
    }
    catch (e) {
        return null;
    }
}

export const usernameState = atom({
    key: 'usernameState',
    default: getKey() || 'ACCOUNT_DEFAULT',
});

export const isLoggedInState = atom({
    key: 'isLoggedInState',
    default: getKey() ? true : false,
});
