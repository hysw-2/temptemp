import React, { useState, useEffect } from "react";
import { Layout, Typography, Avatar, Button, Popover, Form, Input, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import loginAPI from "../api/integrated/loginAPI";
import logoutAPI from "../api/integrated/logoutAPI";

const { Header } = Layout;
const { Title } = Typography;

const UserHeader = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [popoverVisible, setPopoverVisible] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const name = localStorage.getItem("username");
        if (token && name) {
            setIsLoggedIn(true);
            setUsername(name);
        }
    }, []);

    const handleLogin = async (values) => {
        const res = await loginAPI(values);

        if (res.status === 200) {
            message.success("로그인 성공!");
            setUsername(res.body.name);
            setIsLoggedIn(true);
            localStorage.setItem("email", res.body.email);
            localStorage.setItem("name", res.body.name);
            localStorage.setItem("nickName", res.body?.nickName);
            localStorage.setItem("userId", res.body.uid);
            localStorage.setItem("role", res.body.role);
            setPopoverVisible(false);
        } else if (res.code === "AE2") {
            message.error("아이디 혹은 비밀번호가 올바르지 않습니다.");
        } else {
            message.error(res.message || "로그인 실패");
        }
    };

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res.status === 200) {
            message.success("로그아웃 되었습니다.");
        }

        localStorage.clear();
        setIsLoggedIn(false);
        setUsername("");
    };

    const loginContent = (
        <Form onFinish={handleLogin} layout="vertical" style={{ width: 250 }}>
            <Form.Item name="uid" label="아이디" rules={[{ required: true }]}>
                <Input size="small" />
            </Form.Item>
            <Form.Item name="password" label="비밀번호" rules={[{ required: true }]}>
                <Input.Password size="small" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" size="small" block>
                    로그인
                </Button>
            </Form.Item>
            <Form.Item>
                <Button type="link" size="small" block onClick={() => window.location.href = "/signup"}>
                    회원가입
                </Button>
            </Form.Item>
        </Form>
    );

    return (
        <Header style={styles.header}>
            <div style={styles.logoSection}>
                <div style={styles.logoBox} />
                <Title level={4} style={{ margin: 0 }}>midas</Title>
            </div>

            <div style={styles.userSection}>
                {isLoggedIn ? (
                    <>
                        <Avatar icon={<UserOutlined />} />
                        <span style={styles.username}>{username}</span>
                        <span style={styles.mypage} onClick={() => window.location.href = "/mypage"}>마이페이지</span>
                        <Button type="link" onClick={handleLogout}>로그아웃</Button>
                    </>
                ) : (
                    <Popover
                        content={loginContent}
                        title="로그인"
                        trigger="click"
                        open={popoverVisible}
                        onOpenChange={setPopoverVisible}
                        placement="bottomRight"
                    >
                        <Button type="primary">로그인</Button>
                    </Popover>
                )}
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
        gap: 10,
        fontSize: 14,
        position: "relative"
    },
    username: {
        fontWeight: 500,
    },
    mypage: {
        color: "gray",
        cursor: "pointer",
    },
};

export default UserHeader;
