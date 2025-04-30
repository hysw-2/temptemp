import apiClient from "../apiClient";

const deleteUserAPI = async (userId) => {
    try {
        const response = await apiClient.delete(`/api/users/${userId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return {
            status: response.status,
            body: response.data,
        };
    } catch (error) {
        return {
            status: error.response?.status || 500,
            code: error.response?.data?.code,
            message: error.response?.data?.message || "회원 탈퇴 중 오류 발생",
        };
    }
};

export default deleteUserAPI;
