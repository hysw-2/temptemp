import React, { useState, useEffect } from "react";
import { Layout, Input, Select, List, Card, Spin, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import UserHeader from "../components/Header";
import QuickMenu from "../components/QuickMenu";
import { useLocation, useNavigate } from "react-router-dom";
import { searchBills, formatSearchQuery } from "../api/userfnc/searchAPI";

const { Content } = Layout;
const { Option } = Select;

const SearchResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const initialQuery = searchParams.get("query") || "";
    const initialType = searchParams.get("type") || "billTitle";

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [searchType, setSearchType] = useState(initialType);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            try {
                setLoading(true);
                const results = await searchBills(searchType, searchQuery);
                setSearchResults(results);
                // URL 업데이트
                navigate(`/searchresult?type=${searchType}&query=${encodeURIComponent(searchQuery)}`);
            } catch (error) {
                message.error('검색 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (initialQuery) {
            handleSearch({ key: "Enter" });
        }
    }, []);

    const renderSearchResult = (item) => {
    if (searchType === 'billTitle') {
        return (
            <div 
                style={styles.textBlock}
                onClick={() => navigate(`/bills/${item.billId}`)}
            >
                <div style={styles.resultTitle}>{item.billTitle}</div>
                <div style={styles.resultDescription}>
                    안건번호: {item.billNumber}<br></br>
                    발의자: {item.billProposer}<br></br>
                    소관위: {item.committee}<br></br>
                    상태: {item.billStatus}
                </div>
            </div>
        );
    } else if (searchType === 'proposers') {
        return (
            <div 
                style={styles.textBlock}
                onClick={() => navigate(`/proposers/${item.id}`)}
            >
                <div style={styles.resultTitle}>{item.name}</div>
                <div style={styles.resultDescription}>
                    소속 정당: {item.party}<br></br>
                    직책: {item.career}
                </div>
            </div>
        );
    }
};


    return (
        <Layout style={styles.layout}>
            <UserHeader />
            <div style={styles.searchWrapper}>
                <Select
                    value={searchType}
                    style={styles.searchSelect}
                    onChange={setSearchType}
                >
                    <Option value="billTitle">법안명</Option>
                    <Option value="proposers">발의자</Option>
                </Select>
                <Input
                    placeholder="궁금한 발의안을 검색해보세요!"
                    size="large"
                    suffix={<SearchOutlined style={{ color: "#c59fff", fontSize: "1.6vw" }} />}
                    style={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearch}
                />
            </div>
            
            <div style={styles.content}>
                {loading ? (
                    <div style={styles.loadingContainer}>
                        <Spin size="large" />
                    </div>
                ) : searchResults.length > 0 ? (
                    <>
                        <div style={styles.searchInfo}>
                            {formatSearchQuery(searchType, searchQuery)} 검색 결과: {searchResults.length}건
                        </div>
                        <List
                            grid={{ gutter: 16, column: 1 }}
                            dataSource={searchResults}
                            renderItem={renderSearchResult}
                        />
                    </>
                ) : (
                    <div style={styles.noResults}>
                        검색 결과가 없습니다.
                    </div>
                )}
            </div>
            <QuickMenu />
        </Layout>
    );
};

const styles = {
    layout: {
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#fff",
    },
    content: {
        padding: "20px 5%",
        overflowY: "auto",
        height: "calc(100vh - 180px)",
    },
    searchWrapper: {
        paddingTop: '10px',
        width: "100%",
        display: "flex",
        justifyContent: "center",
        gap: "10px",
    },
    searchSelect: {
        width: "120px",
        height: "8.3vh",
        fontSize: "1.2vw",
    },
    searchInput: {
        width: "50vw",
        height: "8.3vh",
        fontSize: "1.4vw",
        borderRadius: "50px",
        padding: "0 2vw",
        border: "2px solid #c59fff",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    },
    loadingContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
    card: {
        width: "100%",
        marginBottom: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    searchInfo: {
        marginBottom: "20px",
        fontSize: "1.2em",
        color: "#666",
    },
    noResults: {
        textAlign: "center",
        padding: "40px",
        fontSize: "1.2em",
        color: "#666",
    },
        textBlock: {
        padding: "16px",
        borderBottom: "1px solid #ddd",
        cursor: "pointer",
    },
    resultTitle: {
        fontSize: "1.2em",
        color: "#1a0dab",
        fontWeight: "bold",
        marginBottom: "6px",
    },
    resultDescription: {
        fontSize: "0.95em",
        color: "#545454",
    },

};

export default SearchResult;
