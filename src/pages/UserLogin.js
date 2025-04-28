import React from "react";
import { Card, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import mainsearch from './MainSearch'

const { Title, Text } = Typography;

const UserLogin = () => {
    const navigate = useNavigate();

    const handleGuestLogin = () => {
        navigate("/search");
    };
    const handleAdminLogin = () =>{
        navigate('/admin')
    };
    const handleKakaoLogin = () =>{
        navigate('/kakao')
    };


    return (
        <div style={styles.container}>
            <Card style={styles.card}>
                {/* 서비스명 */}
                <Title level={2} style={styles.logo}>midas</Title>
                {/* 서비스 간단 소개 */}
                <Text style={styles.description}>
                    국회에서 발의된 어려운 법의 법률안을 알기 쉽게 설명해주는 <br />
                    MIDAS 서비스 입니다.
                </Text>
                {/* 서비스 로고 temp */}
                <div style={styles.logoPlaceholder}></div>
                {/* 입장 버튼 */}
                <Button type="primary" style={styles.kakaoButton} onClick={handleKakaoLogin}>
                    카카오 로그인
                </Button>
                <Button type="default" style={styles.guestButton} onClick={handleGuestLogin}>
                    계정 없이 계속
                </Button>
            </Card>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#F8F9FA",
        flexDirection: "column",
    },
    card: {
        width: 490,
        padding: "20px 30px",
        textAlign: "center",
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
        border: "none",
        marginTop: "-5vh",
    },
    logo: {
        fontSize: 60,
        fontWeight: "bold",
        marginTop: "0px",
        marginBottom: "10px",
    },
    description: {
        marginBottom: 20,
        display: "block",
    },
    logoPlaceholder: {
        width: 200,
        height: 200,
        backgroundColor: "#E0E0E0",
        margin: "20px auto",
        borderRadius: 10,
    },
    kakaoButton: {
        width: "60%",
        backgroundColor: "#FEE500",
        color: "#000",
        fontWeight: "bold",
        marginBottom: 10,
        border: "none",
    },
    guestButton: {
        width: "60%",
    },
};

export default UserLogin;
