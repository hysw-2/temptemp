import React, { useState } from "react";
import { Layout, Menu, Typography, Divider, Button } from "antd";
import {
    UserOutlined,
    ExclamationCircleOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import UserList from "./admin/UserList";
import UserDetail from "./admin/UserDetail";
// import ReportList from "./admin/ReportList";

const { Sider, Content } = Layout;
const { Title } = Typography;

const AdminDashboard = () => {
    const [selectedMenu, setSelectedMenu] = useState("users");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [userListKey, setUserListKey] = useState(0); // 강제 리렌더링용

    const handleUserSelect = (user) => {
        if (user?.userId !== null && user?.userId !== undefined) {
            setSelectedUserId(user.userId);
            console.log("선택된 userId:", user.userId);
        } else {
            console.warn("선택한 유저에 userId가 없음:", user);
        }
    };

    const refreshUserList = () => {
        setUserListKey((prev) => prev + 1);
        setSelectedUserId(null);
    };

    const renderContent = () => {
        switch (selectedMenu) {
            case "users":
                return (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Title level={4}>전체 사용자 목록</Title>
                            <Button icon={<ReloadOutlined />} onClick={refreshUserList}>
                                새로고침
                            </Button>
                        </div>
                        <UserList key={userListKey} onSelectUser={handleUserSelect} />
                        <Divider />
                        {selectedUserId && (
                            <>
                                <Title level={5}>선택된 사용자 상세</Title>
                                <UserDetail userId={selectedUserId} />
                            </>
                        )}
                    </>
                );
            /* case "reports":
                return (
                    <>
                        <Title level={4}>신고 내역 관리</Title>
                        <ReportList />
                    </>
                ); */
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider theme="light">
                <Menu
                    mode="inline"
                    selectedKeys={[selectedMenu]}
                    onClick={({ key }) => setSelectedMenu(key)}
                    items={[
                        {
                            key: "users",
                            icon: <UserOutlined />,
                            label: "사용자 관리",
                        },
                        {
                            key: "reports",
                            icon: <ExclamationCircleOutlined />,
                            label: "신고 관리",
                        },
                    ]}
                />
            </Sider>
            <Layout style={{ padding: "24px" }}>
                <Content>{renderContent()}</Content>
            </Layout>
        </Layout>
    );
};

export default AdminDashboard;
