import axios, {AxiosInstance} from 'axios';

const API_BASE_URL = import.meta.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface SignupPayload {
    username: string;
    password: string;
    image: string;
}

export interface LoginPayload {
    username: string;
    password: string;
}

export interface ChatPayload {
    message: string;
}

export class API{
    async signup(payload: SignupPayload): Promise<void> {
        try {
            await axios.post(`${API_BASE_URL}/register`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            throw new Error(error.response?.data?.detail || error.message);
        }
    }

    /**
     * Log in an existing user.
     * @param payload User login data.
     * @returns The backend response (e.g., user data and token).
     */
    async login(payload: LoginPayload): Promise<{username: string, userId: number}> {
        try {
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:8000/login',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : payload
            };
            const response = await axios.request(config);
            const { username, user_id } = response.data.response;
            return {username, userId: user_id};
        } catch (error) {
            console.error('Login error:', error.response?.data?.detail || error.message);
            throw new Error(error.response?.data?.detail || error.message);
        }
    }

    /**
     * Send a chat message to the backend.
     * @param username
     * @param password
     * @param message The chat message to send.
     * @param token (Optional) Bearer token for authorization.
     * @returns The backend response, e.g., AI chat reply.
     */
    async sendChat(username: string, password: string, message: string, token?: string): Promise<string> {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/chat`,
                { message, username, token },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                    },
                }
            );
            return response.data.response || '';
        } catch (error) {
            console.error('Chat error:', error.response?.data || error.message);
            throw new Error(error.response?.data || error.message);
        }
    }
}
