import React, { useState, useMemo } from "react";
import { Input, Button, List, Form, message, Modal } from "antd";
import { WarningOutlined, EditOutlined, DeleteOutlined, ArrowRightOutlined, MessageOutlined } from "@ant-design/icons";
import Report from "./Report";

const { TextArea } = Input;

const Comment = ({ comments = [], onAddComment, onEditComment, onDeleteComment }) => {
  const [form] = Form.useForm();
  const [reportTarget, setReportTarget] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editForm] = Form.useForm();
  const [replyTo, setReplyTo] = useState(null);
  const [replyForm] = Form.useForm();

  // 댓글 정렬 로직
  const sortedComments = useMemo(() => {
    // 일반 댓글과 대댓글 분리
    const parentComments = comments.filter(comment => !comment.parentCommentId);
    const childComments = comments.filter(comment => comment.parentCommentId);

    // 일반 댓글은 최신순 정렬
    const sortedParentComments = [...parentComments].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    // 대댓글은 오래된 순 정렬
    const sortedChildComments = [...childComments].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    // 부모 댓글 ID별로 대댓글 그룹화
    const childCommentsByParent = sortedChildComments.reduce((acc, comment) => {
      if (!acc[comment.parentCommentId]) {
        acc[comment.parentCommentId] = [];
      }
      acc[comment.parentCommentId].push(comment);
      return acc;
    }, {});

    // 최종 정렬된 댓글 배열 생성
    return sortedParentComments.map(parent => ({
      ...parent,
      replies: childCommentsByParent[parent.commentId] || []
    }));
  }, [comments]);

  const handleSubmit = async (values) => {
    try {
      await onAddComment(values.content);
      message.success("댓글이 등록되었습니다.");
      form.resetFields();
    } catch (error) {
      message.error("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment);
    editForm.setFieldsValue({ content: comment.commentContent });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditSubmit = async (values) => {
    try {
      await onEditComment(editingComment.commentId, values.content);
      message.success("댓글이 수정되었습니다.");
      setEditingComment(null);
    } catch (error) {
      message.error("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await onDeleteComment(commentId);
      message.success("댓글이 삭제되었습니다.");
    } catch (error) {
      message.error("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleReply = (comment) => {
    // 대댓글에는 답글을 달 수 없도록 체크
    if (comment.parentCommentId) {
      message.warning("대댓글에는 답글을 달 수 없습니다.");
      return;
    }
    setReplyTo(comment);
    replyForm.resetFields();
  };

  const handleReplySubmit = async (values) => {
    try {
      await onAddComment(values.content, replyTo.commentId);
      message.success("답글이 등록되었습니다.");
      setReplyTo(null);
      replyForm.resetFields();
    } catch (error) {
      message.error("답글 등록 중 오류가 발생했습니다.");
    }
  };

  const renderCommentContent = (comment, isReply = false) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {isReply && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#666',
            backgroundColor: '#f5f5f5',
            padding: '4px 8px',
            borderRadius: '4px',
            marginBottom: '4px'
          }}>
            <ArrowRightOutlined />
            <span>답글</span>
          </div>
        )}
        <p style={{ margin: 0 }}>{comment.commentContent}</p>
        <p style={{ fontSize: "0.9em", color: "#999", margin: 0 }}>
          작성 시각: {new Date(comment.createdAt).toLocaleString()}
        </p>
      </div>
    );
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <Form form={form} onFinish={handleSubmit} style={{ marginBottom: "20px" }}>
        <Form.Item
          name="content"
          rules={[{ required: true, message: "댓글 내용을 입력해주세요" }]}
        >
          <TextArea
            rows={3}
            placeholder="댓글을 입력하세요"
            style={{ marginBottom: "10px" }}
          />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Button type="primary" htmlType="submit">
            댓글 등록
          </Button>
        </Form.Item>
      </Form>

      <List
        dataSource={sortedComments}
        renderItem={(comment) => (
          <div>
            <List.Item
              actions={[
                <Button type="link" icon={<MessageOutlined />} onClick={() => handleReply(comment)}>
                  답글
                </Button>,
                <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(comment)}>
                  수정
                </Button>,
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => handleDelete(comment.commentId)}
                >
                  삭제
                </Button>,
                <Button
                  type="link"
                  icon={<WarningOutlined />}
                  onClick={() => setReportTarget(comment)}
                >
                  신고
                </Button>
              ]}
            >
              <List.Item.Meta
                description={renderCommentContent(comment)}
              />
            </List.Item>
            {/* 대댓글 렌더링 */}
            {comment.replies && comment.replies.length > 0 && (
              <div style={{ marginLeft: '40px' }}>
                {comment.replies.map((reply) => (
                  <List.Item
                    key={reply.commentId}
                    actions={[
                      <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(reply)}>
                        수정
                      </Button>,
                      <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDelete(reply.commentId)}
                      >
                        삭제
                      </Button>,
                      <Button
                        type="link"
                        icon={<WarningOutlined />}
                        onClick={() => setReportTarget(reply)}
                      >
                        신고
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      description={renderCommentContent(reply, true)}
                    />
                  </List.Item>
                ))}
              </div>
            )}
          </div>
        )}
      />

      <Report
        visible={!!reportTarget}
        onClose={() => setReportTarget(null)}
        targetId={reportTarget?.commentId}
        type="comment"
      />

      <Modal
        title="댓글 수정"
        open={!!editingComment}
        onCancel={() => setEditingComment(null)}
        footer={null}
      >
        <Form form={editForm} onFinish={handleEditSubmit} layout="vertical">
          <Form.Item
            name="content"
            label="수정 내용"
            rules={[{ required: true, message: "내용을 입력해주세요" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              수정하기
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="답글 작성"
        open={!!replyTo}
        onCancel={() => setReplyTo(null)}
        footer={null}
      >
        <Form form={replyForm} onFinish={handleReplySubmit} layout="vertical">
          <Form.Item
            name="content"
            label="답글 내용"
            rules={[{ required: true, message: "답글 내용을 입력해주세요" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              답글 등록
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Comment;
