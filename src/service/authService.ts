import { LoginData } from "@/interface/Login";
import apiClient from "./apiClient";
// import { useNavigate } from "react-router-dom";

export const signIn = async (data: LoginData) => {
    return (await apiClient.post('/auth/login?flag=advertiser', data));
}

export const refreshTokenApi2 = async () => {
  // // eslint-disable-next-line react-hooks/rules-of-hooks
  // const navigate = useNavigate();
    const response = await apiClient.post('/auth/refresh?flag=advertiser', {
      refreshToken: localStorage.getItem('refreshToken')
    });
    console.log('Res Status Code:',response.status);
    if (response.status == 401) {
      console.log('Token refresh failed');
      // navigate('/auth/sign-in');
      window.location.href = '/auth/sign-in';
    }
    return response.data.data;

};
export const getProfile = async () => {
    const response = await apiClient.get('/advertiser/profile');
    return response.data.data;
}

export const getTop = async () => {
    const response = await apiClient.get('/advertiser/top');
    return response.data.data;
}

export const getStats = async () => {
    const response = await apiClient.get('/advertiser/statistics');
    return response.data.data;
}

