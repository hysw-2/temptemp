import React, { useState, useEffect } from "react";
import {  Layout,  Table,  Tag,  Modal,  Typography,  Button,  Select,  message} from "antd";
import axios from "axios";
import UserHeader from "../components/Header";
import Comment from "../components/Comment";
import QuickMenu from "../components/QuickMenu";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const Discussion = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billOptions, setBillOptions] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  // 1. 법안 데이터 불러오기
  useEffect(() => {
    axios
      .get("/api/bills/search")
      .then((res) => {
        const billList = res.data.content.map((bill) => ({
          billNumber: bill.billNumber,
          billTitle: bill.billTitle,
          committee: bill.committee,
        }));
        setBillOptions(billList);
      })
      .catch((err) => {
        console.error("API 요청 실패:", err.message);
        message.error("법안 데이터를 불러오지 못했습니다");
      });
  }, []);

  // 2. 글 작성 제출
  const handleSubmitPost = () => {
    if (!selectedBill) return;
    const now = new Date();
    const newPost = {
      id: Date.now(),
      committee: selectedBill.committee,
      billNumber: selectedBill.billNumber,
      billTitle: selectedBill.billTitle,
      title: `[${selectedBill.billNumber}]  [${selectedBill.billTitle}]`,
      author: "현재사용자",
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      timestamp: now.getTime(),
      content: ""
    };

    setPosts((prev) => [newPost, ...prev]);
    setIsModalOpen(false);
    setSelectedBill(null);
    message.success("게시글이 등록되었습니다!");
  };

  // 3. 댓글 추가
  const handleAddComment = (postId, content) => {
    const now = new Date();
    const newComment = {
      id: Date.now(),
      author: "현재사용자",
      date: now.toISOString(),
      content,
    };

    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));
  };

  // 4. 테이블 컬럼
  const columns = [
    {
      title: "소관 위원회",
      dataIndex: "committee",
      key: "committee",
      width: "15%",
      render: (text, record) => (
        <a onClick={() => setSelectedPost(record)}
        style={{
            fontSize: "16px",
            color: 'black'    
        }}
        >{text}</a>
      ),
    },
    {
        title: "의안번호",
        dataIndex: "billNumber",
        key: "billNumber",
        width: "15%",
        render: (text, record) => (
          <a onClick={() => setSelectedPost(record)}
          style={{
              fontSize: "16px",
              color: 'black' 
          }}
          >{text}</a>
        ),
      },
      {
        title: "법률안명",
        dataIndex: "billTitle",
        key: "billTitle",
        width: "65%",
        ellipsis: true,
        render: (text, record) => (
          <a onClick={() => setSelectedPost(record)}
          style={{
              fontSize: "16px",
              color: 'black',
              fontWeight: '600'   
          }}
          >{text}</a>
        ),
      },
    {
      title: "작성자",
      dataIndex: "author",
      key: "author",
      width: "10%",
    },
    {
      title: "작성일",
      dataIndex: "date",
      key: "date",
      width: "10%",
      render: (_, record) => (
        <div>
          <div>{record.date}</div>
          <div style={{ fontSize: "12px", color: "#999" }}>{record.time}</div>
        </div>
      ),
    },
  ];

  return (
    <Layout style={styles.layout}>
      <UserHeader />
      <Content style={styles.content}>
        <div style={styles.boardContainer}>
          <div style={styles.header}>
            <Title level={2} style={styles.boardTitle}>
              토론 게시판
            </Title>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              새 글 작성
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={posts}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            style={styles.table}
          />
        </div>
      </Content>

      {/* 새 글 작성 모달 */}
      <Modal
        title="법안 선택 후 글 등록"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmitPost}
        okButtonProps={{ disabled: !selectedBill }}
        width={800}
      >
        <Select
          showSearch
          style={{ width: "100%", marginBottom: "20px" }}
          placeholder="법안 번호 또는 제목으로 검색"
          optionFilterProp="children"
          onChange={(value) => {
            const bill = billOptions.find((b) => b.billNumber === value);
            setSelectedBill(bill);
          }}
          filterOption={(input, option) => {
            const val = `${option.value} ${option.children}`.toLowerCase();
            return val.includes(input.toLowerCase());
          }}
        >
          {billOptions.map((bill) => (
            <Option key={bill.billNumber} value={bill.billNumber}>
              {bill.billNumber} - {bill.billTitle}
            </Option>
          ))}
        </Select>

      </Modal>

      {/* 게시글 상세 모달 */}
      <Modal
        title={selectedPost?.title}
        open={!!selectedPost}
        onCancel={() => setSelectedPost(null)}
        footer={null}
        width={800}
      >
        {selectedPost && (
          <div style={styles.modalContent}>
            <div style={styles.postHeader}>
              <Text type="secondary">
                {selectedPost.author} | {selectedPost.date} {selectedPost.time}
              </Text>
            </div>
            <Comment
              comments={comments[selectedPost.id] || []}
              onAddComment={(content) =>
                handleAddComment(selectedPost.id, content)
              }
            />
          </div>
        )}
      </Modal>
      <div>
        <QuickMenu />
      </div>
    </Layout>
  );
};

const styles = {
  layout: {
    height: "100vh",
    backgroundColor: "#fff",
  },
  content: {
    height: "calc(100vh - 64px)",
    textAlign: "left",
    padding: "20px 50px",
    backgroundColor: "#f5f5f5",
  },
  boardContainer: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  boardTitle: {
    margin: 0,
    color: "#333",
  },
  table: {
    backgroundColor: "#fff",
  },
  modalContent: {
    padding: "20px 0",
  },
  postHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  postContent: {
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
  },
};

export default Discussion;
