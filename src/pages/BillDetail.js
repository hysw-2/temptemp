import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout, Spin, message } from "antd";
import UserHeader from "../components/Header";
import QuickMenu from "../components/QuickMenu";
import apiClient from "../api/apiClient";
const { Content } = Layout;

const BillDetail = () => {
    const { billId } = useParams();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBill = async () => {
            try {
                const response = await apiClient.get(`/api/bills/${billId}`);
                setBill(response.data);
            } catch (error) {
                message.error("법안 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchBill();
    }, [billId]);

    if (loading) {
        return (
            <Layout style={styles.layout}>
                <UserHeader />
                <div style={styles.loading}><Spin size="large" /></div>
                <QuickMenu />
            </Layout>
        );
    }

    if (!bill) {
        return (
            <Layout style={styles.layout}>
                <UserHeader />
                <div style={styles.loading}>법안 정보를 찾을 수 없습니다.</div>
                <QuickMenu />
            </Layout>
        );
    }

    return (
        <Layout style={styles.layout}>
            <UserHeader />
            <Content style={styles.content}>
                <h3 level={2}>{bill.billh3}</h3>
                <h1><strong></strong> {bill.billTitle}</h1>
                <p><strong>안건번호:</strong> {bill.billNumber}</p>
                <p><strong>발의일:</strong> {new Date(bill.billDate).toLocaleDateString()}</p>
                <p><strong>발의자:</strong> {bill.billProposer}</p>
                <p><strong>소관 위원회:</strong> {bill.committee}</p>
                <p><strong>진행 상태:</strong> {bill.billStatus}</p>

                
                <h3 level={4}>세부 내용</h3>
                <p style={styles.preserveLineBreak}>{bill.detail}</p>
                

                <h3 level={4}>요약</h3>
                <p style={styles.aiBox}>{bill.summary}</p>

                

                <h3 level={4}>영향 예측</h3>
                <p style={styles.aiBox}>{bill.prediction}</p>
            </Content>
            <QuickMenu />
        </Layout>
    );
};

const styles = {
    layout: {
        height: "100vh",
        backgroundColor: "#fff",
        overflow: "hidden",
    },
    content: {
        padding: "24px 10%",
        height: "calc(100vh - 180px)",
        overflowY: "auto",
    },
    loading: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 180px)",
        fontSize: "1.2em",
        color: "#666",
    },
    preserveLineBreak: {
        whiteSpace: "pre-wrap",
    },
    aiBox:{
        backgroundColor: 'rgb(227, 227, 227)',
        whitespace:'pre-wrap',
        padding:'5px',
        borderRadius:'10px',
        border:'2px,solid,rgba(54, 54, 54, 0.23)',

    },
};

export default BillDetail;
