import { axiosAuthInstance } from "@/utils/axiosInstance";
export interface registerData {
    username: string;
    email: string;
    password: string;
}
export const login = async (username: string, password: string): Promise<any> => {
    try {
        const response = await axiosAuthInstance.post("auth/login", {
            username,
            password,
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};
export const register = async (registerData: registerData): Promise<any> => {
    try {
        const response = await axiosAuthInstance.post("auth/register", {
            ...registerData,
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};
export const sendRequestCode = async (email: string): Promise<any> => {
    try {
        const response = await axiosAuthInstance.post("auth/forget-password", {
            email,
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};
export const verifyCode = async (email: string, code: string): Promise<any> => {
    try {
        const trimmedEmail = email.trim();
        const trimmedCode = code.trim();
        if (__DEV__) {
            console.log('API verifyCode called with:', {
                email: trimmedEmail,
                code: trimmedCode,
                codeType: typeof trimmedCode,
                codeLength: trimmedCode.length,
            });
        }

        const response = await axiosAuthInstance.post("auth/verify-otp", {
            email: trimmedEmail,
            otp: trimmedCode,
        });
        return response.data;
    } catch (error: any) {
        if (__DEV__) {
            console.log('API verifyCode error:', {
                status: error?.response?.status,
                data: error?.response?.data,
                message: error?.message,
            });
        }
        throw error;
    }
};
export const resetPassword = async (email: string, newPassword: string, otp: string): Promise<any> => {
    try {
        const response = await axiosAuthInstance.post("auth/reset-password", {
            email,
            newPassword,
            otp,
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};