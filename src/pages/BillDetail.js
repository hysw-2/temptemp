import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout, Spin, message, Card } from "antd";
import UserHeader from "../components/Header";
import QuickMenu from "../components/QuickMenu";
import DownloadPdf from "../components/DownloadPdf";
import apiClient from "../api/apiClient";

const { Content } = Layout;

const BillDetail = () => {
    const { billId } = useParams();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBill = async () => {
            try {
                const response = await apiClient.get(`/bills/${billId}`);
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
                <div style={styles.titleContainer}>
                    <h1><strong></strong> {bill.billTitle}
                    <DownloadPdf billId={billId} /></h1>
                </div>

                <div style={{padding:"12px 0px"}}>
                <p><strong>안건번호:</strong> {bill.billNumber}</p>
                <p><strong>발의일:</strong> {new Date(bill.billDate).toLocaleDateString()}</p>
                <p><strong>발의자:</strong> {bill.billProposer}</p>
                <p><strong>소관 위원회:</strong> {bill.committee}</p>
                <p><strong>진행 상태:</strong> {bill.billStatus}</p>
                </div>


                <div style={{padding:"12px 0px"}}>
                <h3 level={4}>세부 내용</h3>
                <Card>
                <p style={styles.preserveLineBreak}>{bill.detail}</p>
                </Card>
                </div>

                <div style={{padding:"12px 0px"}}>
                <h3 level={4}>요약</h3>
                <Card>
                <p>{bill.summary}</p>
                </Card>
                </div>
                
                <div style={{padding:"12px 0px"}}>
                <h3 level={4}>영향 예측</h3>
                <Card>
                <p>{bill.prediction}</p>
                </Card>
                </div>

                <div style={{padding:"12px 0px"}}>
                <h3 level={4}>용어 설명</h3>
                <Card>
                <p>{bill.term}</p>
                </Card>
                </div>
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
        padding: "24px 20%",
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
    titleContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
};

export default BillDetail;
