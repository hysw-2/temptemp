import React, { useState, useEffect } from "react";
import { Table, Typography, Button, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "../api/userfnc/postAPI";

const { Title } = Typography;

const Discussion = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPosts();
        const sortedPosts = response.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
        setPosts(sortedPosts);
      } catch (error) {
        message.error("게시글을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleRowClick = (record) => {
    navigate(`/discussion/${record.postId}`);
  };

  const columns = [
    {
      title: <div style={{ textAlign: 'center', fontSize: '15px', fontWeight: 'bold' }}>제목</div>,
      dataIndex: "postTitle",
      key: "postTitle",
      width: "50%",
      render: (text) => <span style={{ fontSize: "14px", paddingLeft: "10px" }}>{text}</span>,
    },
    {
      title: <span style={{ fontSize: '15px', fontWeight: 'bold' }}>작성일</span>,
      dataIndex: "postDate",
      key: "postDate",
      width: "25%",
      align: 'center',
      render: (date) => <span style={{ fontSize: "14px" }}>{new Date(date).toLocaleDateString()}</span>,
    },
    {
      title: <span style={{ fontSize: '15px', fontWeight: 'bold' }}>작성자</span>,
      dataIndex: "author",
      key: "author",
      width: "25%",
      align: 'center',
      render: (author) => <span style={{ fontSize: "14px" }}>{author}</span>,
    },
  ];

  if (loading) {
    return <div style={styles.loadingContainer}><Spin size="large" /></div>;
  }

  return (
      <div style={styles.container}>
        <div style={styles.boardContainer}>
          <Table
              size="small"
              title={() => (
                  <div style={styles.header}>
                    <Title level={2} style={styles.boardTitle}>토론 게시판</Title>
                    <Button type="primary">새 글 작성</Button>
                  </div>
              )}
              columns={columns}
              dataSource={posts}
              rowKey="postId"
              pagination={{ pageSize: 8 }}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
                style: { cursor: 'pointer' },
              })}
              style={{ marginBottom: '0px' }}
          />
        </div>
      </div>
  );
};

const styles = {
  loadingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 194px)' },
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', minHeight: 'calc(100vh - 194px)' },
  boardContainer: { width: '80%', backgroundColor: "#fff", padding: "10px 20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: 'flex', flexDirection: 'column' },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  boardTitle: { margin: 0, fontSize: '18px', fontWeight: '600', color: "#333" },
};

export default Discussion;