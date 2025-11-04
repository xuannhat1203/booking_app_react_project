// axiosInstance.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";

let accessToken: string | null = null;

export const initializeAxiosToken = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    setAccessToken(token);
};

// Axios instances
export const axiosAuthInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.243:8080/api/v1/",
    headers: { "Content-Type": "application/json" },
});

const axiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.243:8080/api/v1/",
    headers: { "Content-Type": "application/json" },
});

// Interceptor request
axiosInstance.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// Setter cho token
export const setAccessToken = (token: string | null) => {
    accessToken = token;
    if (token) {
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common.Authorization;
    }
};

// Interceptor response (xử lý refresh token)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = await AsyncStorage.getItem("refreshToken");
                const response = await axios.post("http://192.168.1.243:8080/api/v1/auth/refresh-token", { refreshToken });

                const newAccessToken = response?.data?.accessToken;
                if (newAccessToken) {
                    await AsyncStorage.setItem("accessToken", newAccessToken);
                    setAccessToken(newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                // Clear tokens on refresh failure
                await AsyncStorage.removeItem("accessToken");
                await AsyncStorage.removeItem("refreshToken");
                setAccessToken(null);
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors (403, 404, 500, etc.)
        const errorMessage = getErrorMessage(error);
        return Promise.reject({ ...error, userMessage: errorMessage });
    }
);

// Add error interceptor for axiosAuthInstance as well
axiosAuthInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle errors for auth endpoints
        const errorMessage = getErrorMessage(error);
        return Promise.reject({ ...error, userMessage: errorMessage });
    }
);

// Helper function to clean server messages
const cleanServerMessage = (message: string | undefined): string | null => {
    if (!message || typeof message !== 'string') {
        return null;
    }
    
    // Remove technical patterns more aggressively
    let cleaned = message
        .replace(/^(AxiosError|Error|Request failed|NetworkError|TypeError):\s*/i, '')
        .replace(/Request failed with status code \d+/i, '')
        .replace(/AxiosError:\s*/gi, '')
        .replace(/\[.*?AxiosError.*?\]/gi, '')
        .replace(/Request failed with status code/gi, '')
        .replace(/status code \d+/gi, '')
        .replace(/ECONNREFUSED|ENOTFOUND|ETIMEDOUT|ECODE/gi, '')
        .replace(/Network request failed/gi, '')
        .replace(/timeout of \d+ms exceeded/gi, '')
        .trim();
    
    // Check if still technical
    const lower = cleaned.toLowerCase();
    if (lower.includes('axioserror') || 
        lower.includes('request failed') || 
        lower.includes('status code') ||
        lower.includes('axios') ||
        lower.includes('network error') ||
        /^\d{3}/.test(cleaned) ||
        /error:\s*$/i.test(cleaned)) {
        return null;
    }
    
    return cleaned.length > 3 ? cleaned : null;
};

// Helper function to extract error message
const getErrorMessage = (error: AxiosError): string => {
    if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data as any;

        // For authentication errors (401, 403), check for user-friendly message first
        if (status === 401 || status === 403) {
            // Try to get message from errors.message (server-specific format)
            const errorsMessage = data?.errors?.message;
            if (errorsMessage && typeof errorsMessage === 'string') {
                const cleaned = cleanServerMessage(errorsMessage);
                if (cleaned && !isTechnicalMessage(cleaned)) {
                    return cleaned;
                }
            }
            
            // Try to get message from data.message
            const serverMessage = cleanServerMessage(data?.message);
            if (serverMessage && !isTechnicalMessage(serverMessage)) {
                return serverMessage;
            }
            
            // Fallback to default friendly message
            if (status === 401) {
                return 'Tên đăng nhập hoặc mật khẩu không đúng.';
            }
            return 'Bạn không có quyền truy cập.';
        }

        // For other errors, try to get clean message from server
        const serverMessage = cleanServerMessage(data?.message) || 
                             cleanServerMessage(data?.error) ||
                             cleanServerMessage(data?.errors?.message);
        if (serverMessage && !isTechnicalMessage(serverMessage)) {
            return serverMessage;
        }

        // Fallback to status-based messages
        switch (status) {
            case 400:
                return 'Thông tin không hợp lệ. Vui lòng kiểm tra lại.';
            case 404:
                return 'Không tìm thấy tài nguyên.';
            case 422:
                return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
            case 500:
                return 'Lỗi máy chủ. Vui lòng thử lại sau.';
            case 503:
                return 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.';
            default:
                return 'Đã xảy ra lỗi. Vui lòng thử lại.';
        }
    } else if (error.request) {
        // Request was made but no response received
        return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.';
    } else {
        // Something else happened - don't show technical error.message
        return 'Đã xảy ra lỗi. Vui lòng thử lại.';
    }
};

// Helper to check if message is technical (used in getErrorMessage)
const isTechnicalMessage = (message: string): boolean => {
    if (!message || typeof message !== 'string') {
        return true;
    }
    const lower = message.toLowerCase();
    return lower.includes('axioserror') || 
           lower.includes('request failed') || 
           lower.includes('status code') ||
           /^\d{3}/.test(message.trim());
};

export default axiosInstance;
