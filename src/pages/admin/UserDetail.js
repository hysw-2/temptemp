import React, { useEffect, useState } from "react";
import { Descriptions, Spin } from "antd";
import fetchAdminUserDetailAPI from "../../api/admin/fetchAdminUserDetailAPI";

const UserDetail = ({ userId }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const load = async () => {
            const res = await fetchAdminUserDetailAPI(userId);
            if (res.status === 200) {
                setUser(res.body);
            }
        };
        if (userId) load();
    }, [userId]);

    if (!user) return <Spin />;

    return (
        <Descriptions bordered column={1}>
            <Descriptions.Item label="UID">{user.uid}</Descriptions.Item>
            <Descriptions.Item label="닉네임">{user.nickName}</Descriptions.Item>
            <Descriptions.Item label="이메일">{user.email}</Descriptions.Item>
            <Descriptions.Item label="전화번호">{user.phoneNumber}</Descriptions.Item>
            <Descriptions.Item label="역할">{user.role}</Descriptions.Item>
        </Descriptions>
    );
};

export default UserDetail;
