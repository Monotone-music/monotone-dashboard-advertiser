import apiClient from "./apiClient";

// Add these new endpoints
export const getByStatus = async (status: string) => {
    const response = await apiClient.get(`/advertiser/${status}`);
    return response.data.data;
};

export const updateStatus = async (id: string) => {
    const response = await apiClient.patch(`/advertisement/disable/${id}`);
    return response.data.data;
};

export const cancelPendingReq = async (id: string) => {
    const response = await apiClient.patch(`/advertisement/reject/${id}`);
    return response.data.data;
};
