import React, { useEffect, useState, useMemo } from "react";
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
    const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });

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
                    <h1>{bill.billTitle} <DownloadPdf billId={billId}/></h1>
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
        display: "flex",
        alignItems: "center",
        gap: "10px",
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

};

export default BillDetail;
