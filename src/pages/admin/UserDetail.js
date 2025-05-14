import React, { useEffect, useState } from "react";
import { Descriptions } from "antd";
import fetchAdminUserDetailAPI from "../../api/admin/fetchAdminUserDetailAPI";

const UserDetail = ({ userId }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const result = await fetchAdminUserDetailAPI(userId);
            if (result.status === 200) {
                setUser(result.body || result);
            }
        };
        if (userId != null) fetchUser();
    }, [userId]);


    return (
        <Descriptions bordered column={1}>
            <Descriptions.Item label="UID">{user?.uid}</Descriptions.Item>
            <Descriptions.Item label="userId">{user?.userId}</Descriptions.Item>
            <Descriptions.Item label="닉네임">{user?.nickName}</Descriptions.Item>
            <Descriptions.Item label="이메일">{user?.email}</Descriptions.Item>
            <Descriptions.Item label="이름">{user?.name}</Descriptions.Item>
            <Descriptions.Item label="전화번호">{user?.phoneNumber}</Descriptions.Item>
            <Descriptions.Item label="역할">{user?.role}</Descriptions.Item>
        </Descriptions>
    );
};

export default UserDetail;
