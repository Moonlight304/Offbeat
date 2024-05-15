import { atom } from 'recoil'

function getItemWithExpiration(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
        return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date().getTime();

    if (now > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    
    return item.value;
}


const usernameFromStorage = getItemWithExpiration('username');
const isLoggedInFromStorage = getItemWithExpiration('isLoggedIn');

export const usernameState = atom({
    key: 'usernameState',
    default: usernameFromStorage || 'ACCOUNT_DEFAULT',
});

export const isLoggedInState = atom({
    key: 'isLoggedInState',
    default: isLoggedInFromStorage !== null ? isLoggedInFromStorage : false,
});