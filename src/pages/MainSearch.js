import React from "react";
import { Layout, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import UserHeader from "../components/Header";
import QuickMenu from "../components/QuickMenu";

const { Content } = Layout;

const MainPage = () => {
    return (
        <Layout style={styles.layout}>
            <UserHeader />
            <Content style={styles.content}>
                <div style={styles.searchWrapper}>
                    <Input
                        placeholder="궁금한 발의안을 검색해보세요!"
                        size="large"
                        suffix={<SearchOutlined style={{ color: "#c59fff", fontSize: "1.6vw" }} />}
                        style={styles.searchInput}
                    />
                </div>
            </Content>
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
        height: "calc(100vh - 64px - 100px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "25vh",
    },
    searchWrapper: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
    },
    searchInput: {
        width: "60vw",
        height: "8.3vh",
        fontSize: "1.4vw",
        borderRadius: "50px",
        padding: "0 2vw",
        border: "2px solid #c59fff",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    },
};

export default MainPage;
