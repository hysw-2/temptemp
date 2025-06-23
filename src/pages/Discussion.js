import React, { useState, useEffect } from "react";
import { Layout, Typography, Button, Input, Form, message, Card, Pagination, Modal } from "antd";
import UserHeader from "../components/Header";
import Comment from "../components/Comment";
import QuickMenu from "../components/QuickMenu";
import { createPost, getAllPosts, deletePost, editPost } from "../api/userfnc/postAPI";
import { getCommentsByPostId, createComment } from "../api/userfnc/commentAPI";
import { EditOutlined, DeleteOutlined, WarningOutlined } from "@ant-design/icons";
import Report from "../components/Report";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const Discussion = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [editingPost, setEditingPost] = useState(null);
  const [editForm] = Form.useForm();
  const [reportTarget, setReportTarget] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getAllPosts();
      const sorted = response.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
      setPosts(sorted);

      // 댓글도 모두 미리 불러옴
      for (const post of sorted) {
        console.log(`게시글 ${post.postId}의 댓글 로딩 중...`);
        const postComments = await getCommentsByPostId(post.postId);
        console.log(`게시글 ${post.postId}의 댓글 데이터:`, postComments);
        setComments(prev => ({ ...prev, [post.postId]: postComments }));
      }
    } catch (err) {
      console.error("게시글/댓글 불러오기 오류:", err);
      message.error("게시글 불러오기 실패");
    }
  };

  const handleSubmitPost = async (values) => {
    setLoading(true);
    try {
      const {title, content} = values;
      await createPost(title, content);
      message.success("게시글이 등록되었습니다.");
      form.resetFields();
      fetchPosts();
    } catch (err) {
      message.error("게시글 등록 실패");
      console.error("게시글 등록 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (postId, content) => {
    try {
      console.log("댓글 등록 시도:", { postId, content });
      await createComment(postId, content);
      
      console.log("댓글 등록 완료, 새로운 댓글 목록 가져오는 중...");
      const updated = await getCommentsByPostId(postId);
      console.log("업데이트된 댓글 목록:", updated);
      
      setComments(prev => {
        const newComments = { ...prev, [postId]: updated };
        console.log("댓글 상태 업데이트:", { 이전상태: prev, 새로운상태: newComments });
        return newComments;
      });
      
      message.success("댓글이 등록되었습니다.");
    } catch (err) {
      console.error("댓글 등록 오류:", err);
      message.error("댓글 등록 실패");
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    editForm.setFieldsValue({
      title: post.postTitle,
      content: post.content,
    });
  };

  const handleEditPostSubmit = async (values) => {
    try {
      await editPost(editingPost.postId, values.title, values.content);
      message.success("게시글이 수정되었습니다.");
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      message.error("게시글 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      message.success("게시글이 삭제되었습니다.");
      fetchPosts();
    } catch (error) {
      message.error("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  const pagedPosts = posts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Layout style={styles.layout}>
      <UserHeader />
      <Content style={styles.content}>
        <div style={styles.container}>
          <Title level={2}>토론 게시판</Title>
          <Form form={form} onFinish={handleSubmitPost} layout="vertical" style={styles.form}>
            <Form.Item name="title" rules={[{ required: true, message: "제목을 입력해주세요" }]}> 
              <Input placeholder="제목" /> 
            </Form.Item>
            <Form.Item name="content" rules={[{ required: true, message: "내용을 입력해주세요" }]}> 
              <TextArea rows={4} placeholder="내용" /> 
            </Form.Item>
            <Form.Item> 
              <Button type="primary" htmlType="submit" loading={loading}>작성</Button> 
            </Form.Item>
          </Form>

          {pagedPosts.map((post) => (
            <Card key={post.postId} style={styles.postCard}>
              <div style={styles.postHeader}>
                <Text strong>{post.author}</Text>
                <Text type="secondary" style={{ marginLeft: 8 }}>{new Date(post.postDate).toLocaleString()}</Text>
              </div>
              <Title level={4}>{post.postTitle}</Title>
              <p>{post.content}</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <Button type="link" icon={<EditOutlined />} onClick={() => handleEditPost(post)}>수정</Button>
                <Button type="link" icon={<DeleteOutlined />} danger onClick={() => handleDeletePost(post.postId)}>삭제</Button>
                <Button type="link" icon={<WarningOutlined />} onClick={() => setReportTarget(post)}>신고</Button>
              </div>
              <Comment
                postId={post.postId}
                comments={comments[post.postId] || []}
                onAddComment={(content) => handleAddComment(post.postId, content)}
                fetchComments={async () => {
                  try {
                    const updated = await getCommentsByPostId(post.postId);
                    setComments(prev => ({ ...prev, [post.postId]: updated }));
                  } catch (err) {
                    console.error("댓글 새로고침 오류:", err);
                    message.error("댓글을 새로고침하는 중 오류가 발생했습니다.");
                  }
                }}
              />
            </Card>
          ))}

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={posts.length}
            onChange={page => setCurrentPage(page)}
            style={{ marginTop: 24 }}
          />
        </div>
      </Content>
      <div style={styles.quickMenuWrapper}><QuickMenu /></div>
      <Report
        visible={!!reportTarget}
        onClose={() => setReportTarget(null)}
        targetId={reportTarget?.postId}
        type="post"
        targetAuthor={reportTarget?.author}
      />
      <Modal title="게시글 수정" open={!!editingPost} onCancel={() => setEditingPost(null)} footer={null}>
        <Form form={editForm} onFinish={handleEditPostSubmit} layout="vertical">
          <Form.Item
            name="title"
            label="제목"
            rules={[{ required: true, message: "제목을 입력해주세요" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="내용"
            rules={[{ required: true, message: "내용을 입력해주세요" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">수정하기</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

const styles = {
  layout: {
    height: "100vh",
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 20%",
    paddingBottom: 100,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    paddingBottom: 100,
  },
  form: {
    marginBottom: 32,
    background: "#fff",
    padding: 20,
    borderRadius: 8,
  },
  postCard: {
    borderRadius: 8,
    marginBottom: 24,
  },
  postHeader: {
    marginBottom: 12,
  },
  quickMenuWrapper: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#fff",
    boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
    zIndex: 1000,
  },
};

export default Discussion;
