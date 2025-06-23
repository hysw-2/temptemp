// src/pages/admin/ReportedPosts.js

import React, { useEffect, useState } from "react";
import { Layout, Table, Button, message } from "antd";
import { getReportedPostsByUser, getReportDetail } from "../../api/admin/userAPI";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;

const ReportedPosts = () => {
    const [reports, setReports] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const testUserId = "1"; // 실제 존재하는 userId로 테스트
            const res = await getReportedPostsByUser(testUserId);
            console.log("📦 신고 응답:", res);
            setReports(res);
        } catch (err) {
            console.error("❌ API 호출 실패:", err);
            message.error("신고된 게시글 목록을 불러오는 데 실패했습니다.");
        }
    };


    const handleDetailClick = async (reportId) => {
        try {
            const detail = await getReportDetail(reportId);
            const postId = detail?.postId;
            if (postId) {
                navigate(`/bills/detail`, { state: { id: postId } });
            } else {
                message.warning("게시글 정보를 찾을 수 없습니다.");
            }
        } catch (err) {
            message.error("신고 상세 정보를 불러오는 데 실패했습니다.");
        }
    };

    const columns = [
        {
            title: "게시글 ID",
            dataIndex: "postId",
            key: "postId",
        },
        {
            title: "제목",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "신고일",
            dataIndex: "reportedAt",
            key: "reportedAt",
            render: (text) =>
                text ? new Date(text).toLocaleString() : "날짜 없음",
        },
        {
            title: "조치",
            key: "action",
            render: (_, record) => (
                <Button onClick={() => handleDetailClick(record.reportId)}>
                    상세보기
                </Button>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: "calc(100vh - 64px)", backgroundColor: "#fff" }}>
            <Content style={{ padding: "30px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 600 }}>신고된 게시글</h2>
                <Table
                    columns={columns}
                    dataSource={reports}
                    rowKey={(record) => record.reportId || `${record.postId}-${record.title}`}
                    pagination={{ pageSize: 10 }}
                    style={{ marginTop: 20 }}
                />
            </Content>
        </Layout>
    );
};

export default ReportedPosts;
