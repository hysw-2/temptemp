import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import QuickMenu from "../components/QuickMenu";
import bookmarkRankingAPI from "../api/userfnc/bookmarkRankingAPI";
import rankingAPI from "../api/userfnc/rankingAPI";
import { useNavigate } from "react-router-dom";
import { Card } from "antd";

const Ranking = () => {
    const navigate = useNavigate();
    const [bookmarkRanking, setBookmarkRanking] = useState([]);
    const [viewRanking, setViewRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                setLoading(true);
                const bookmarkResponse = await bookmarkRankingAPI();
                const viewResponse = await rankingAPI();

                setBookmarkRanking(Array.isArray(bookmarkResponse.content) ? bookmarkResponse.content : []);
                setViewRanking(Array.isArray(viewResponse.content) ? viewResponse.content : []);
                setError(null);
            } catch (error) {
                console.error("랭킹 데이터를 가져오는 중 오류가 발생했습니다:", error);
                setError("데이터를 불러오는 중 오류가 발생했습니다.");
                setBookmarkRanking([]);
                setViewRanking([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
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
                {/* 북마크 랭킹 박스 */}
                <div style={{width: "40%"}}>
                    <Card style={{height: "98%"}}>
                        <h2 style={{textAlign: "center", fontSize: "16px", marginBottom: "20px", color: "#333"}}>
                            토론이 활발한 법안
                        </h2>
                        <div>
                            {bookmarkRanking.length > 0 ? (
                                bookmarkRanking.map((bill, index) => (
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
                                        <span style={{
                                            flexShrink: "0",
                                            whiteSpace: "nowrap",
                                            marginLeft: "10px"
                                        }}>
                                            북마크: {bill.bookmarkCount}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div style={{textAlign: "center", padding: "10px"}}>
                                    Loading...
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* 조회수 랭킹 박스 */}
                <div style={{width: "40%"}}>
                    <Card style={{height: "98%"}}>
                        <h2 style={{textAlign: "center", fontSize: "16px", marginBottom: "20px", color: "#333"}}>
                            조회수가 높은 법안
                        </h2>
                        <div>
                            {viewRanking.length > 0 ? (
                                viewRanking.map((bill, index) => (
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
                                        <span style={{
                                            flexShrink: "0",
                                            whiteSpace: "nowrap",
                                            marginLeft: "10px"
                                        }}>
                                            조회수: {bill.billCount}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div style={{textAlign: "center", padding: "10px"}}>
                                    Loading...
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
            <div style={{position: "fixed", bottom: 0, width: "100%", zIndex: 100}}>
                <QuickMenu/>
            </div>
        </div>
    );
};

export default Ranking;
