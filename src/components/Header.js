import React from "react";
import { Layout, Typography, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Title } = Typography;

const UserHeader = () => {
    return (
        <Header style={styles.header}>
            <div style={styles.logoSection}>
                <div style={styles.logoBox} />
                <Title level={4} style={{ margin: 0 }}>midas</Title>
            </div>
            <div style={styles.userSection}>
                <Avatar icon={<UserOutlined />} />
                <span style={styles.username}>유저명</span>
                <span style={styles.mypage}>마이페이지</span>
            </div>
        </Header>
    );
};

const styles = {
    header: {
        background: "#fff",
        borderBottom: "1px solid #ddd",
        padding: "0 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logoSection: {
        display: "flex",
        alignItems: "center",
        gap: 10,
    },
    logoBox: {
        width: 40,
        height: 40,
        backgroundColor: "#d9d9d9",
    },
    userSection: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 14,
    },
    username: {
        fontWeight: 500,
    },
    mypage: {
        color: "gray",
    },
};

export default UserHeader;