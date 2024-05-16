import { atom } from 'recoil';
import { jwtDecode } from 'jwt-decode';

function getCookie(key) {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');
    for (let cookie of cookies) {
        const [name, value] = cookie.split('=').map(c => c.trim());
        if (name === key)
            return value;
    }
    return null;
}

function getKey() {
    try {
        const jwt_token = getCookie('jwt_token');
        if (!jwt_token) {
            return null;
        }
        const decodedObj = jwtDecode(jwt_token);
        return decodedObj.username;
    } catch (error) {
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
