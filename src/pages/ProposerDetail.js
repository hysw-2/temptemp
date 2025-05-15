import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout, Spin, message } from "antd";
import UserHeader from "../components/Header";
import QuickMenu from "../components/QuickMenu";
import axios from "axios";

const { Content } = Layout;

const ProposerDetail = () => {
    const { proposerId } = useParams();
    const [proposer, setProposer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProposer = async () => {
            try {
                const response = await axios.get(`http://3.106.116.44:8080/api/proposers/${proposerId}`);
                setProposer(response.data);
            } catch (error) {
                console.error("발의자 정보를 불러오는 중 오류 발생:", error);
                message.error("발의자 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchProposer();
    }, [proposerId]);

    if (loading) {
        return (
            <Layout>
                <UserHeader />
                <Content style={styles.loading}>
                    <Spin size="large" />
                </Content>
                <QuickMenu />
            </Layout>
        );
    }

    if (!proposer) {
        return (
            <Layout>
                <UserHeader />
                <Content style={styles.error}>
                    <p>발의자 정보를 찾을 수 없습니다.</p>
                </Content>
                <QuickMenu />
            </Layout>
        );
    }

    return (
        <Layout style={styles.layout}>
            <UserHeader />
            <Content style={styles.content}>
                <h2>{proposer.name}</h2>
                <p><strong>정당:</strong> {proposer.party}</p>
                <p><strong>출생일:</strong> {proposer.birth}</p>
                <p><strong>직업:</strong> {proposer.job}</p>
                <p><strong>출신 지역:</strong> {proposer.origin}</p>
                <p><strong>소속 위원회:</strong> {proposer.committees}</p>
                <p><strong>주요 경력:</strong></p>
                <pre style={styles.pre}>{proposer.memberTitle}</pre>
            </Content>
            <QuickMenu />
        </Layout>
    );
};

const styles = {
    layout: {
        backgroundColor: "#fff",
        minHeight: "100vh",
    },
    content: {
        padding: "20px 20%",
    },
    loading: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    error: {
        padding: "40px",
        textAlign: "center",
    },
    pre: {
        whiteSpace: "pre-wrap",
        backgroundColor: "#f7f7f7",
        padding: "12px",
        borderRadius: "8px",
        fontFamily: "inherit",
    },
};

export default ProposerDetail;
