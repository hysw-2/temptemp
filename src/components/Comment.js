import React, { useState, useMemo } from "react";
import { Input, Button, List, Form, message, Modal } from "antd";
import { WarningOutlined, EditOutlined, DeleteOutlined, ArrowRightOutlined, MessageOutlined } from "@ant-design/icons";
import Report from "./Report";

const { TextArea } = Input;

const Comment = ({ postId, comments = [], onAddComment, onEditComment, onDeleteComment, fetchComments }) => {
  const [form] = Form.useForm();
  const [reportTarget, setReportTarget] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editForm] = Form.useForm();

  const sortedComments = useMemo(() => {
    // 모든 댓글을 날짜순으로 정렬 (최신순)
    return [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

  const renderCommentContent = (comment) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ margin: 0 }}>{comment.commentContent}</p>
        <p style={{ fontSize: "0.9em", color: "#999", margin: 0 }}>
          작성자: {comment.author} | 작성 시각: {new Date(comment.createdAt).toLocaleString()}
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
                <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(comment)}>수정</Button>,
                <Button type="link" icon={<DeleteOutlined />} danger onClick={() => handleDelete(comment.commentId)}>삭제</Button>,
                <Button type="link" icon={<WarningOutlined />} onClick={() => setReportTarget(comment)}>신고</Button>
              ]}
            >
              <List.Item.Meta description={renderCommentContent(comment)} />
            </List.Item>
          </div>
        )}
      />

      <Report
        visible={!!reportTarget}
        onClose={() => setReportTarget(null)}
        targetId={reportTarget?.commentId}
        type="comment"
      />

      <Modal title="댓글 수정" open={!!editingComment} onCancel={() => setEditingComment(null)} footer={null}>
        <Form form={editForm} onFinish={handleEditSubmit} layout="vertical">
          <Form.Item
            name="content"
            label="수정 내용"
            rules={[{ required: true, message: "내용을 입력해주세요" }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">수정하기</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Comment;
