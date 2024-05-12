import { atom } from 'recoil'

export const usernameState = atom({
    key: 'usernameState',
    default: localStorage.getItem('username') || 'ACCOUNT_DEFAULT'
})

export const isLoggedInState = atom({
    key: 'isLoggedInState',
    default: JSON.parse(localStorage.getItem('isLoggedIn')) || false
})