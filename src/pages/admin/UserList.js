import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import fetchAdminUserListAPI from "../../api/admin/fetchUserListAPI";

const UserList = ({ onSelectUser }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const loadUsers = async () => {
            const res = await fetchAdminUserListAPI();
            if (res.status === 200) {
                setUsers(res.body.content);
            } else {
                message.error("사용자 목록 로딩 실패");
            }
        };
        loadUsers();
    }, []);

    const columns = [
        { title: "UID", dataIndex: "uid", key: "uid" },
        { title: "UserID", dataIndex: "userId", key: "userId" },
        { title: "닉네임", dataIndex: "nickName", key: "nickName" },
        { title: "이메일", dataIndex: "email", key: "email" },
        { title: "역할", dataIndex: "role", key: "role" },
        {
            title: "상세",
            key: "action",
            render: (_, record) => (
                <a onClick={() => {
                    if (record.userId !== null && record.userId !== undefined) {
                        onSelectUser(record.userId);
                    } else {
                        message.warning("userId가 존재하지 않습니다.");
                    }
                }}>보기</a>
            ),
        },
    ];

    return (
        <Table rowKey="uid" columns={columns} dataSource={users} pagination={{ pageSize: 10 }} />
    );
};

export default UserList;
