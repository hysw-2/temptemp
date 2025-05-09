import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import fetchUserListAPI from "../../api/admin/fetchUserListAPI";

const UserList = ({ onSelectUser }) => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const res = await fetchUserListAPI();
        if (res.status === 200) {
            setData(res.body.content);
        } else {
            message.error("사용자 목록 불러오기 실패");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { title: "UID", dataIndex: "uid", key: "uid" },
        { title: "닉네임", dataIndex: "nickName", key: "nickName" },
        { title: "이메일", dataIndex: "email", key: "email" },
        { title: "역할", dataIndex: "role", key: "role" },
        {
            title: "상세",
            key: "action",
            render: (_, record) => (
                <a
                    onClick={() => {
                        if (record.userId != null) {
                            onSelectUser(record); // 전체 레코드 전달
                        } else {
                            console.warn("userId가 null입니다:", record);
                            message.warning("해당 유저는 상세 정보를 볼 수 없습니다.");
                        }
                    }}
                >
                    보기
                </a>
            ),
        },
    ];

    return (
        <Table
            rowKey={(record) => record.uid || record.userId}
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
        />
    );
};

export default UserList;
