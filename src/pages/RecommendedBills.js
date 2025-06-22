import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import QuickMenu from "../components/QuickMenu";
import { useNavigate } from "react-router-dom";
import { Card, message } from "antd";
import apiClient from "../api/apiClient";

const RecommendedBills = () => {
    const navigate = useNavigate();
    const [recommendedBills, setRecommendedBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendedBills = async () => {
            try {
                const userId = localStorage.getItem("userId");

                if (!userId) {
                    message.warning("로그인이 필요합니다.");
                    return;
                }

                const response = await apiClient.post("/recommend/user", { userId });
                setRecommendedBills(response.data);
            } catch (error) {
                console.error("추천 법안을 불러오는 데 실패했습니다:", error);
                message.error("추천 법안 불러오기 실패");
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedBills();
    }, []);

    return (
        <div style={{position: "relative", height: "100vh", overflow: "hidden"}}>
            <div style={{position: "fixed", top: 0, width: "100%", zIndex: 100}}>
                <Header/>
            </div>
            <div style={{
                marginTop: "40px",
                marginBottom: "80px",
                height: "calc(100vh - 64px - 80px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden"
            }}>
                <div style={{width: "60%"}}>
                    <Card style={{minHeight: "300px"}}>
                        <h2 style={{
                            textAlign: "center",
                            fontSize: "16px",
                            marginBottom: "20px",
                            color: "#333"
                        }}>
                            사용자 맞춤형 추천 법안
                        </h2>

                        {loading ? (
                            <div style={{textAlign: "center"}}>Loading...</div>
                        ) : recommendedBills.length > 0 ? (
                            recommendedBills.map((bill, index) => (
                                <div
                                    key={bill.billId}
                                    onClick={() => navigate(`/bills/${bill.billId}`)}
                                    style={{
                                        padding: "9px",
                                        borderBottom: "1px solid #eee",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: "10px",
                                        cursor: "pointer"
                                    }}
                                >
                                    <span style={{
                                        flex: "1",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {index + 1}. {bill.billTitle}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div style={{textAlign: "center", color: "#888"}}>
                                추천 법안이 없습니다.
                            </div>
                        )}
                    </Card>
                </div>
            </div>
            <div style={{position: "fixed", bottom: 0, width: "100%", zIndex: 100}}>
                <QuickMenu/>
            </div>
        </div>
    );
};

export default RecommendedBills;
