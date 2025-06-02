import React, { useState, useEffect } from "react";
import { Layout, Table, Modal, Typography, Button, Input, Form, message } from "antd";
import UserHeader from "../components/Header";
import Comment from "../components/Comment";
import QuickMenu from "../components/QuickMenu";
import { createPost, deletePost, editPost, getAllPosts, getPostById } from "../api/userfnc/postAPI";
import { createComment, deleteComment, editComment, getCommentsByPostId } from "../api/userfnc/commentAPI";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const Discussion = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();

  // 게시글 목록 불러오기
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getAllPosts();
      // 최신 게시글이 먼저 오도록 정렬
      const sortedPosts = response.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
      console.log("Fetched posts:", sortedPosts); // 디버깅용 로그
      setPosts(sortedPosts);
    } catch (error) {
      message.error("게시글을 불러오는데 실패했습니다.");
    }
  };

  // 게시글 작성
  const handleSubmitPost = async (values) => {
    try {
      await createPost(values.title, values.content);
      message.success("게시글이 등록되었습니다!");
      setIsModalOpen(false);
      form.resetFields();
      fetchPosts();
    } catch (error) {
      message.error("게시글 등록에 실패했습니다.");
    }
  };

  // 게시글 수정
  const handleEditPost = async (values) => {
    try {
      await editPost(selectedPost.id, values.title, values.content);
      message.success("게시글이 수정되었습니다!");
      setIsModalOpen(false);
      setIsEditMode(false);
      setSelectedPost(null);
      form.resetFields();
      fetchPosts();
    } catch (error) {
      message.error("게시글 수정에 실패했습니다.");
    }
  };

  // 게시글 삭제
  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      message.success("게시글이 삭제되었습니다!");
      setSelectedPost(null);
      fetchPosts();
    } catch (error) {
      message.error("게시글 삭제에 실패했습니다.");
    }
  };

  // 댓글 추가
  const handleAddComment = async (postId, commentContent) => {
    if (!postId) {
      message.error("게시글 정보가 없습니다.");
      return;
    }
    try {
      await createComment(postId, commentContent);
      const updatedComments = await getCommentsByPostId(postId);
      setComments(prev => ({
        ...prev,
        [postId]: updatedComments
      }));
    } catch (error) {
      message.error("댓글 등록에 실패했습니다.");
    }
  };

  // 댓글 수정
  const handleEditComment = async (commentId, commentContent) => {
    if (!selectedPost || !selectedPost.id) {
      message.error("게시글 정보가 없습니다.");
      return;
    }
    try {
      await editComment(commentId, commentContent);
      const updatedComments = await getCommentsByPostId(selectedPost.id);
      setComments(prev => ({
        ...prev,
        [selectedPost.id]: updatedComments
      }));
    } catch (error) {
      message.error("댓글 수정에 실패했습니다.");
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    if (!selectedPost || !selectedPost.id) {
      message.error("게시글 정보가 없습니다.");
      return;
    }
    try {
      await deleteComment(commentId);
      const updatedComments = await getCommentsByPostId(selectedPost.id);
      setComments(prev => ({
        ...prev,
        [selectedPost.id]: updatedComments
      }));
    } catch (error) {
      message.error("댓글 삭제에 실패했습니다.");
    }
  };

  // 테이블 컬럼
  const columns = [
    {
      title: "제목",
      dataIndex: "postTitle",
      key: "postTitle",
      width: "60%",
      render: (text, record) => (
        <a
          onClick={async () => {
            try {
              await fetchComments(record.postId);
              setSelectedPost({ ...record, id: record.postId }); // 💡 강제 id 매핑
            } catch (error) {
              message.error("댓글을 불러오는데 실패했습니다.");
            }
          }}
          style={{
            fontSize: "16px",
            color: 'black',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "작성일",
      dataIndex: "postDate",
      key: "postDate",
      width: "20%",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "작성자",
      dataIndex: "author",
      key: "author",
      width: "20%",
    },
  ];

  const fetchComments = async (postId) => {
    if (!postId) {
      console.error("postId is undefined");
      return;
    }
    try {
      const response = await getCommentsByPostId(postId);
      setComments(prev => ({
        ...prev,
        [postId]: response
      }));
    } catch (error) {
      message.error("댓글을 불러오는데 실패했습니다.");
    }
  };

  // 게시글 상세 모달
  const renderPostDetailModal = () => {
    if (!selectedPost) return null;

    return (
      <Modal
        title={selectedPost.postTitle}
        open={!!selectedPost}
        onCancel={() => {
          setSelectedPost(null);
          setComments(prev => ({
            ...prev,
            [selectedPost.id]: []
          }));
        }}
        footer={[
          <Button key="edit" onClick={() => {
            setIsEditMode(true);
            setIsModalOpen(true);
            form.setFieldsValue({
              title: selectedPost.postTitle,
              content: selectedPost.content
            });
          }}>
            수정
          </Button>,
          <Button key="delete" danger onClick={() => handleDeletePost(selectedPost.id)}>
            삭제
          </Button>
        ]}
        width="80%"
        style={{ top: 20 }}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 200px)',
            overflow: 'auto',
            padding: '24px'
          }
        }}
      >
        <div style={styles.modalContent}>
          <div style={styles.postHeader}>
            <Text type="secondary">
              {selectedPost.author} | {new Date(selectedPost.postDate).toLocaleString()}
            </Text>
          </div>
          <div style={styles.postContent}>
            {selectedPost.content}
          </div>
          <div style={styles.commentSection}>
            <Title level={4} style={{ marginBottom: '20px' }}>댓글</Title>
            {selectedPost.id && (
              <Comment
                comments={comments[selectedPost.id] || []}
                onAddComment={(content) => handleAddComment(selectedPost.id, content)}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
              />
            )}
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <UserHeader />
      <Content style={styles.content}>
        <div style={styles.boardContainer}>
          <div style={styles.header}>
            <Title level={2} style={styles.boardTitle}>
              토론 게시판
            </Title>
            <Button type="primary" onClick={() => {
              setIsModalOpen(true);
              setIsEditMode(false);
              form.resetFields();
            }}>
              새 글 작성
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={posts}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            style={styles.table}
            onRow={(record) => ({
              onClick: () => {
                setSelectedPost(record);
                if (record.id) {
                  fetchComments(record.id);
                }
              },
              style: { cursor: 'pointer' }
            })}
          />
        </div>
      </Content>

      {/* 게시글 작성/수정 모달 */}
      <Modal
        title={isEditMode ? "게시글 수정" : "새 글 작성"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          form.resetFields();
        }}
        footer={null}
        width="80%"
        style={{ top: 20 }}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 200px)',
            overflow: 'auto'
          }
        }}
      >
        <Form
          form={form}
          onFinish={isEditMode ? handleEditPost : handleSubmitPost}
          initialValues={selectedPost}
        >
          <Form.Item
            name="title"
            rules={[{ required: true, message: "제목을 입력해주세요" }]}
          >
            <Input placeholder="제목을 입력하세요" />
          </Form.Item>
          <Form.Item
            name="content"
            rules={[{ required: true, message: "내용을 입력해주세요" }]}
          >
            <TextArea rows={6} placeholder="내용을 입력하세요" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "수정하기" : "등록하기"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 게시글 상세 모달 */}
      {renderPostDetailModal()}
      <QuickMenu />
    </div>
  );
};

const styles = {
  layout: {
    backgroundColor: "#fff",
  },
  content: {
    height: "calc(100vh - 64px)",
    textAlign: "left",
    padding: "20px 50px",
    backgroundColor: "#f5f5f5",
    paddingBottom: "50px",
    overflow: "auto",
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
    padding: "0",
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
    minHeight: "100px",
  },
  commentSection: {
    marginTop: "30px",
    borderTop: "1px solid #e8e8e8",
    paddingTop: "20px",
  },
};

export default Discussion;
