import React from "react";
import { Layout, Tabs } from "antd";
import UserHeader from "../../components/Header";
import UserManagement from "./UserManagement";
import ReportedPosts from "./ReportedPosts";

const { Content } = Layout;

const AdminDashboard = () => {
    return (
        <Layout>
            <UserHeader />
            <Content style={{ padding: "20px 10%" }}>
                <Tabs defaultActiveKey="1" type="card">
                    <Tabs.TabPane tab="사용자 관리" key="1">
                        <UserManagement />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="신고된 게시물" key="2">
                        <ReportedPosts />
                    </Tabs.TabPane>
                </Tabs>
            </Content>
        </Layout>
    );
};

export default AdminDashboard;
