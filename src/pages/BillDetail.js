import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Layout, Spin, message, Card } from "antd";
import LinkBillInfo from "../components/LinkBillInfo";
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

    const terms = useMemo(() => {
        try {
            const parsed = JSON.parse(bill?.term || "{}");
            return parsed.terms || [];
        } catch {
            return [];
        }
    }, [bill]);

    const highlightedDetail = useMemo(() => {
        if (!bill?.detail) return bill?.detail || "";

        let content = bill.detail;

        if (content.startsWith("제안이유 및 주요내용")) {
            content = content.slice("제안이유 및 주요내용".length).trimStart();
        }

        const usedTerms = new Set();

        terms.forEach(({ term, description }) => {
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(`(${escapedTerm})`, "g");

            let foundOnce = false;
            content = content.replace(regex, (match) => {
                if (!usedTerms.has(term) && !foundOnce) {
                    usedTerms.add(term);
                    foundOnce = true;
                    return `<span class="highlighted-term" 
                    style="font-weight:bold; color:#2a72de; border-bottom:1px dashed #2a72de; cursor:help"
                    data-explanation="${description}">${match}</span>`;
                }
                return match;
            });
        });
        return content;
    }, [bill?.detail, terms]);

    const formatPrediction = () => {
        try {
            const prediction = JSON.parse(bill.prediction || "{}");

            const renderEffectList = (effects, title, color) => (
                <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ color, fontWeight: "bold" }}>{title}</h3>
                    <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
                        {effects.map((item, i) => (
                            <li key={i} style={{ marginBottom: "8px", lineHeight: "1.8" }}>
                                <strong>{item.title}</strong>: {item.description}
                            </li>
                        ))}
                    </ul>
                </div>
            );

            return (
                <>
                    {prediction.positive_effects &&
                        renderEffectList(prediction.positive_effects, "[긍정적 영향]", "#0A9100")}
                    {prediction.negative_effects &&
                        renderEffectList(prediction.negative_effects, "[부정적 영향]", "#E30000")}
                </>
            );
        } catch {
            return <p style={{ lineHeight: "1.8" }}>{bill.prediction}</p>;
        }
    };

    const formatSummary = () => {
        try {
            const summary = JSON.parse(bill.summary || "{}");
            return (
                <>
                    {summary.summary && (
                        <div style={{ marginBottom: "16px" }}>
                            <h4 style={{ fontWeight: "bold", color: "#0300b2" }}>요약</h4>
                            <p style={{ margin: 0, lineHeight: "1.8" }}>{summary.summary}</p>
                        </div>
                    )}
                    {summary.purpose && (
                        <div style={{ marginBottom: "16px" }}>
                            <h4 style={{ fontWeight: "bold", color: "#0300b2" }}>제안 목적</h4>
                            <p style={{ margin: 0, lineHeight: "1.8" }}>{summary.purpose}</p>
                        </div>
                    )}
                </>
            );
        } catch {
            return <p style={{ lineHeight: "1.8" }}>{bill.summary}</p>;
        }
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
                <div style={styles.loading}><Spin size="large" /></div>
            </Layout>
        );
    }

    if (!bill) {
        return (
            <Layout style={styles.layout}>
                <div style={styles.loading}>법안 정보를 찾을 수 없습니다.</div>
            </Layout>
        );
    }
    return (
        <Layout style={styles.layout}>
            <Content style={styles.content}>
                <div style={styles.titleContainer}>
                    <h1>{bill.billTitle} <LinkBillInfo billId={billId}/></h1>
                </div>

                <div style={{padding: "12px 0px"}}>
                    <p><strong>안건번호:</strong> {bill.billNumber}</p>
                    <p><strong>발의일:</strong> {new Date(bill.billDate).toLocaleDateString()}</p>
                    <p><strong>발의자:</strong> {bill.billProposer}</p>
                    <p><strong>발의자 소속:</strong> {bill.poly}</p>
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
                    <Card>{formatSummary()}</Card>
                </div>

                <div style={{padding: "12px 0px"}}>
                    <h3>영향 예측</h3>
                    <Card>{formatPrediction()}</Card>
                </div>

                {tooltip.visible && (
                    <div style={{...styles.tooltip, top: tooltip.y, left: tooltip.x}}>
                        {tooltip.text}
                    </div>
                )}
            </Content>
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
