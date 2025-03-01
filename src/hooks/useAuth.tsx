import { useState, useEffect } from 'react';
import {API} from "@/services/api.ts";

export interface AuthState {
    id: string,
    username: string;
    password: string;
}

export const STORAGE_KEY = 'authState';

function getStoredAuth(): AuthState {
    // Check localStorage first (persistent storage)
    let storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
        try {
            return JSON.parse(storedData);
        } catch (e) {
            console.error('Error parsing localStorage auth data:', e);
        }
    }
    // Fallback to sessionStorage
    storedData = sessionStorage.getItem(STORAGE_KEY);
    if (storedData) {
        try {
            return JSON.parse(storedData);
        } catch (e) {
            console.error('Error parsing sessionStorage auth data:', e);
        }
    }
    return { id: '', username: '', password: ''};
}

export default function useAAuth() {
    const [auth, setAuth] = useState<AuthState>(getStoredAuth);
    const api = new API();

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    }, [auth]);

    const login = async (username: string, password: string) => {
        const response = await api.login({username, password})
        const newAuth: AuthState = {id: response.userId, username, password };
        setAuth(newAuth);
    };

    const signup = (username: string, password: string) => {
        return api.signup({username, password})
    };

    const logout = () => {
        setAuth({ username: '', password: '', id: '' });
        localStorage.removeItem(STORAGE_KEY);
    };

    return { auth, login, logout, signup };
}
