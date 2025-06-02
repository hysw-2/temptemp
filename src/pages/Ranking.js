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
    
                // 응답에서 content만 추출
                setBookmarkRanking(Array.isArray(bookmarkResponse.content) ? bookmarkResponse.content : []);
                setViewRanking(Array.isArray(viewResponse.content) ? viewResponse.content : []);
                
                setError(null);
            } catch (error) {
                console.error('랭킹 데이터를 가져오는 중 오류가 발생했습니다:', error);
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
                setBookmarkRanking([]);
                setViewRanking([]);
            } finally {
                setLoading(false);
            }
        };
    
        fetchRankings();
    }, []);
    

    
    return (
        <div>
            <Header />
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '20px', 
                marginTop: '20px'
            }}>
                {/* 북마크 랭킹 박스 */}
                <div><Card>
                    <h2 style={{ 
                        textAlign: 'center', 
                        fontsize:'16px',
                        marginBottom: '20px',
                        color: '#333'
                    }}>토론이 활발한 법안</h2>
                    <div>
                        {bookmarkRanking.length > 0 ? (
                            bookmarkRanking.map((bill, index) => (
                                <div key={bill.billId} 
                                onClick={() => navigate(`/bills/${bill.billId}`)}
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #eee',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    gap: '10px',
                                    cursor: 'pointer'
                                }}>
                                    <span style={{
                                        flex: '1',
                                        wordBreak: 'break-word',
                                        minWidth: '0'
                                    }}>{index + 1}. {bill.billTitle}</span>
                                    <span style={{
                                        flexShrink: '0',
                                        whiteSpace: 'nowrap',
                                        marginLeft: '10px'
                                    }}>북마크: {bill.bookmarkCount}</span>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '10px' }}>
                                Loading...
                            </div>
                        )}
                    </div>
                    </Card>
                </div>

                {/* 조회수 랭킹 박스 */}
                <div><Card>
                    <h2 style={{ 
                        textAlign: 'center', 
                        fontsize:'16px',
                        marginBottom: '20px',
                        color: '#333'
                    }}>조회수가 높은 법안</h2>
                    <div>
                        {viewRanking.length > 0 ? (
                            viewRanking.map((bill, index) => (
                                <div key={bill.billId} 
                                onClick={() => navigate(`/bills/${bill.billId}`)}
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #eee',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    gap: '10px',
                                    cursor: 'pointer'
                                }}>
                                    <span style={{
                                        flex: '1',
                                        wordBreak: 'break-word',
                                        minWidth: '0'
                                    }}>{index + 1}. {bill.billTitle}</span>
                                    <span style={{
                                        flexShrink: '0',
                                        whiteSpace: 'nowrap',
                                        marginLeft: '10px'
                                    }}>조회수: {bill.billCount}</span>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '10px' }}>
                                Loading...
                            </div>
                        )}
                    </div>
                    </Card>
                </div>
            </div>
            <QuickMenu />
        </div>
    );
};

export default Ranking;