import apiClient from "../apiClient";

const loginUser = async (loginData) => {
    try {
        console.log('로그인 요청 데이터:', loginData);
        const response = await apiClient.post('/api/login', loginData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('로그인 응답 데이터:', response.data);

        const { accessToken, name, uid, role, userId, email, phoneNumber, nickName } = response.data;

        if (accessToken) {
            console.log('토큰 저장 시도:', { accessToken, name, uid, role });
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("username", name);
            localStorage.setItem("uid", uid);
            localStorage.setItem("role", role);
            localStorage.setItem("userId", userId);
            localStorage.setItem("email", email);
            localStorage.setItem("phoneNumber", phoneNumber);
            localStorage.setItem("nickName", nickName);
            console.log('localStorage 저장 완료');
        }

        return {
            status: response.status,
            body: response.data,
        };
    } catch (error) {
        console.error('로그인 에러 상세:', error);
        console.error('에러 응답:', error.response);
        const res = error.response;
        return {
            status: res?.status || 500,
            code: res?.data?.code,
            message: res?.data?.message || "서버 오류가 발생했습니다.",
        };
    }
};

export default loginUser;
