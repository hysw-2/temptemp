import React, { useState } from "react";
import { Layout, Menu, Typography, Divider, Button } from "antd";
import { UserOutlined, ExclamationCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import UserList from "./UserList";
import UserDetail from "./UserDetail";
import UserHeader from "../../components/Header";

const { Sider, Content } = Layout;
const { Title } = Typography;

const AdminDashboard = () => {
    const [selectedMenu, setSelectedMenu] = useState("users");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [userListKey, setUserListKey] = useState(0);

    const handleUserSelect = (userId) => {
        if (userId != null) {
            setSelectedUserId(userId);
            console.log("선택된 user:", userId);
        } else {
            console.warn("userId가 null입니다:", userId);
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
                        <div style={styles.contentHeader}>
                            <Title level={4} style={{ margin: 0 }}>전체 사용자 목록</Title>
                            <Button icon={<ReloadOutlined />} onClick={refreshUserList}>
                                새로고침
                            </Button>
                        </div>
                        <UserList key={userListKey} onSelectUser={handleUserSelect} />
                        <Divider />
                        {selectedUserId != null && (
                            <>
                                <Title level={5}>선택된 사용자 상세</Title>
                                <UserDetail userId={selectedUserId} />
                            </>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <UserHeader />

            <Layout>
                <Sider theme="light" width={200}>
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedMenu]}
                        onClick={({ key }) => setSelectedMenu(key)}
                        items={[
                            { key: "users", icon: <UserOutlined />, label: "사용자 관리" },
                            { key: "reports", icon: <ExclamationCircleOutlined />, label: "신고 관리" },
                        ]}
                        style={{ height: "100%", borderRight: 0 }}
                    />
                </Sider>

                <Layout style={{ padding: "24px" }}>
                    <Content style={{ background: "#fff", padding: 24 }}>
                        {renderContent()}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

const styles = {
    contentHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
};

export default AdminDashboard;
