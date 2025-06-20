import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Layout, Spin, message, Card, Button, Progress } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import UserHeader from "../components/Header";
import QuickMenu from "../components/QuickMenu";
import DownloadPdf from "../components/DownloadPdf";
import apiClient from "../api/apiClient";
import voteAPI from "../api/userfnc/voteAPI";
import Bookmark from '../components/Bookmark';

const { Content } = Layout;

const BillDetail = () => {
    const { billId } = useParams();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });
    const [userVote, setUserVote] = useState(null);

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

    const parsedTerms = useMemo(() => {
        if (!bill?.term) return [];
        const termRegex = /\d+\.\s*([^:]+):\s*([^\n]+)/g;
        const result = [];
        let match;
        while ((match = termRegex.exec(bill.term)) !== null) {
            result.push({ term: match[1].trim(), explanation: match[2].trim() });
        }
        return result;
    }, [bill]);

    const highlightedDetail = useMemo(() => {
        if (!bill?.detail) return bill?.detail || "";

        const usedTerms = new Set();
        let content = bill.detail;

        parsedTerms.forEach(({ term, explanation }) => {
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(`(${escapedTerm})`, "g");

            let foundOnce = false;
            content = content.replace(regex, (match) => {
                if (!usedTerms.has(term) && !foundOnce) {
                    usedTerms.add(term);
                    foundOnce = true;
                    return `<span class="highlighted-term" 
                        style="font-weight:bold; color:#2a72de; border-bottom:1px dashed #2a72de; cursor:help"
                        data-explanation="${explanation}">${match}</span>`;
                }
                return match;
            });
        });

        return content;
    }, [bill?.detail, parsedTerms]);

    function formatPrediction(predictionText) {
        const sections = predictionText.split(/\[(긍정적|부정적) 영향\]/).filter(Boolean);

        return sections.map((section, idx) => {
            const isLabel = idx % 2 === 0;
            if (isLabel) return null;

            const label = sections[idx - 1];
            const color = label === "긍정적" ? "#0A9100" : "#E30000";
            const title = `[${label} 영향]`;

            const items = section
                .split(/(?=\d+\.\s)/)
                .filter(item => item.trim().length > 0)
                .map((item, i) => {
                    const match = item.match(/\*\*(.+?)\*\*:(.+)/);
                    if (match) {
                        const [_, strong, rest] = match;
                        return (
                            <li key={i} style={{ marginBottom: "8px", lineHeight: "1.8" }}>
                                <strong>{strong}</strong>: {rest.trim()}
                            </li>
                        );
                    }
                    return <li key={i}>{item.trim()}</li>;
                });

            return (
                <div key={idx} style={{ marginBottom: "20px" }}>
                    <h3 style={{ color, fontWeight: "bold" }}>{title}</h3>
                    <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>{items}</ul>
                </div>
            );
        });
    }

    const formatSummary = (text) => {
        // [소제목] 본문 구조 매칭
        const sections = text.split(/(?=\[[^\]]+\])/g);

        return sections.map((section, index) => {
            const match = section.match(/^\[([^\]]+)\](.*)/s);
            if (match) {
                const [, title, content] = match;
                return (
                    <div key={index} style={{ marginBottom: "16px" }}>
                        <h4 style={{ fontWeight: "bold", color: "#0300b2", marginBottom: "8px" }}>
                            {title}
                        </h4>
                        <p style={{ margin: 0, lineHeight: "1.8" }}>{content.trim()}</p>
                    </div>
                );
            } else {
                return (
                    <p key={index} style={{ lineHeight: "1.8" }}>
                        {section.trim()}
                    </p>
                );
            }
        });
    };
    useEffect(() => {
        const handleMouseOver = (e) => {
            const target = e.target;
            if (target.classList.contains("highlighted-term")) {
                const explanation = target.getAttribute("data-explanation");
                setTooltip({
                    visible: true,
                    text: explanation,
                    x: e.pageX + 10,
                    y: e.pageY + 10,
                });
            }
        };

        const handleMouseOut = (e) => {
            if (e.target.classList.contains("highlighted-term")) {
                setTooltip({ visible: false, text: "", x: 0, y: 0 });
            }
        };

        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);

        return () => {
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
        };
    }, []);

    const handleVote = async (voteType) => {
        try {
            if (userVote === voteType) {
                // 투표 취소
                await voteAPI(billId, voteType);
                setUserVote(null);
                message.success("투표가 취소되었습니다.");
            } else {
                // 새로운 투표
                await voteAPI(billId, voteType);
                setUserVote(voteType);
                message.success("투표가 등록되었습니다.");
            }
            // 투표 후 법안 정보 새로고침
            const response = await apiClient.get(`/bills/${billId}`);
            setBill(response.data);
        } catch (error) {
            message.error("투표 처리 중 오류가 발생했습니다.");
        }
    };

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
                <div style={styles.titleContainer}>
                    <div style={styles.titleWrapper}>
                        <Bookmark id={Number(billId)} />
                        <h1>{bill.billTitle}</h1>                    
                    <DownloadPdf billId={billId} />
                    </div>
                </div>

                <div style={{padding: "12px 0px"}}>
                    <p><strong>안건번호:</strong> {bill.billNumber}</p>
                    <p><strong>발의일:</strong> {new Date(bill.billDate).toLocaleDateString()}</p>
                    <p><strong>발의자:</strong> {bill.billProposer}</p>
                    <p><strong>소관 위원회:</strong> {bill.committee}</p>
                    <p><strong>진행 상태:</strong> {bill.billStatus}</p>
                </div>

                <div style={{padding: "12px 0px"}}>
                    <h3>세부 내용</h3>
                    <Card>
                        <div
                            style={styles.preserveLineBreak}
                            dangerouslySetInnerHTML={{__html: highlightedDetail}}
                        />
                    </Card>
                </div>

                <div style={{padding: "12px 0px"}}>
                    <h3>쉬운 설명</h3>
                    <Card>
                        {formatSummary(bill.summary)}
                    </Card>
                </div>

                <div style={{padding: "12px 0px"}}>
                    <h3>영향 예측</h3>
                    <Card>
                        {formatPrediction(bill.prediction)}
                    </Card>
                </div>

                <div style={{padding: "12px 0px"}}>
                    <h3>투표하기</h3>
                    <Card>
                        <div style={styles.voteContainer}>
                            <Button 
                                type={userVote === 'YES' ? 'primary' : 'default'}
                                icon={<LikeOutlined />}
                                onClick={() => handleVote('YES')}
                                style={styles.voteButtonYes}
                            />
                            <Button 
                                type={userVote === 'NO' ? 'primary' : 'default'}
                                icon={<DislikeOutlined />}
                                onClick={() => handleVote('NO')}
                                style={styles.voteButtonNo}
                            />
                        </div>
                        <div style={styles.voteStats}>
                            <div style={styles.voteBar}>
                                <div style={styles.voteBarContainer}>
                                    <div 
                                        style={{
                                            ...styles.voteBarFill,
                                            width: `${bill?.yes + bill?.no > 0 ? 
                                                (bill.yes / (bill.yes + bill.no)) * 100 : 0}%`,
                                            backgroundColor: '#1890ff'
                                        }}
                                    />
                                    <div 
                                        style={{
                                            ...styles.voteBarFill,
                                            width: `${bill?.yes + bill?.no > 0 ? 
                                                (bill.no / (bill.yes + bill.no)) * 100 : 0}%`,
                                            backgroundColor: '#ff4d4f'
                                        }}
                                    />
                                </div>
                                <div style={styles.voteCounts}>
                                    <span style={{ color: '#1890ff' }}>찬성 {bill?.yes || 0}표</span>
                                    <span style={{ color: '#ff4d4f' }}>반대 {bill?.no || 0}표</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/*<div style={{ padding: "12px 0px" }}>*/}
                {/*    <h3>용어 설명</h3>*/}
                {/*    <Card><p>{bill.term}</p></Card>*/}
                {/*</div>*/}

                {tooltip.visible && (
                    <div style={{...styles.tooltip, top: tooltip.y, left: tooltip.x}}>
                        {tooltip.text}
                    </div>
                )}
            </Content>
            <QuickMenu/>
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
        //whiteSpace: "pre-line",
        lineHeight: "1.9",
        color: "#222",
        wordBreak: "keep-all",
    },
    titleContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '0 20px'
    },
    titleWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    tooltip: {
        position: "absolute",
        zIndex: 1000,
        background: "#fff",
        color: "#333",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        fontSize: "14px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
        maxWidth: "300px",
        lineHeight: "1.5",
    },
    highlightedTerm: {
        fontWeight: "bold",
        color: "#2a72de",
        borderBottom: "1px dashed #2a72de",
        cursor: "help"
    },
    voteContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        padding: '20px 0',
    },
    voteButtonYes: {
        width: '50px',
        height: '50px',
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        right:'150px'
    },
    voteButtonNo: {
        width: '50px',
        height: '50px',
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        left: '150px'
    },
    voteStats: {
        marginTop: '20px',
    },
    voteBar: {
        maxWidth: '600px',
        margin: '0 auto',
    },
    voteBarContainer: {
        width: '100%',
        height: '30px',
        backgroundColor: '#f0f0f0',
        borderRadius: '15px',
        overflow: 'hidden',
        display: 'flex',
        marginBottom: '10px',
    },
    voteBarFill: {
        height: '100%',
        transition: 'width 0.3s ease-in-out',
    },
    voteCounts: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 10px',
        fontSize: '14px',
    },
};

export default BillDetail;
