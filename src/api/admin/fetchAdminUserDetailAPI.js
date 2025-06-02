import apiClient from "../apiClient";

const fetchAdminUserDetailAPI = async (userId) => {
    try {
        const response = await apiClient.get(`/admin/users/${userId}`);
        return {
            status: response.status,
            body: response.data
        };
    } catch (error) {
        return {
            status: error.response?.status || 500,
            message: error.message
        };
    }
};

export default fetchAdminUserDetailAPI;