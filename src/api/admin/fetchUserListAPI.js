import apiClient from "../apiClient";

const fetchUserListAPI = async (params = {}) => {
    try {
        const res = await apiClient.get("/admin/users", { params });
        return {
            status: res.status,
            body: res.data
        };
    } catch (err) {
        return {
            status: err.response?.status || 500,
            message: err.message
        };
    }
};

export default fetchUserListAPI;