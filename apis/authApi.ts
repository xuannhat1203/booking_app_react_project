import { axiosAuthInstance } from "@/utils/axiosInstance";

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
        const response = await axiosAuthInstance.post("auth/verify-otp", {
            email,
            code,
        });
        return response.data;
    } catch (error: any) {
        throw error;
    }
};