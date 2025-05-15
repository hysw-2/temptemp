import apiClient from "../apiClient";

const loginUser = async (loginData) => {
    try {
        const response = await apiClient.post('/api/login', loginData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const { accessToken, name, uid, role } = response.data;

        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("username", name);
            localStorage.setItem("uid", uid);
            localStorage.setItem("role", role);
        }

        return {
            status: response.status,
            body: response.data,
        };
    } catch (error) {
        const res = error.response;
        return {
            status: res?.status || 500,
            code: res?.data?.code,
            message: res?.data?.message || "서버 오류가 발생했습니다.",
        };
    }
};

export default loginUser;
