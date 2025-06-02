import React, { useState } from "react";
import { Input, Button, List, Form, message } from "antd";

const { TextArea } = Input;

const Comment = ({ comments = [], onAddComment, onEditComment, onDeleteComment }) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            await onAddComment(values.content);
            message.success("댓글이 등록되었습니다.");
            form.resetFields();
        } catch (error) {
            message.error("댓글 등록 중 오류가 발생했습니다.");
        }
    };

    const handleEdit = async (comment) => {
        try {
            await onEditComment(comment.id, comment.commentContent);
            message.success("댓글이 수정되었습니다.");
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
                dataSource={comments}
                renderItem={(comment) => (
                    <List.Item
                        actions={[
                            <Button type="link" onClick={() => handleEdit(comment)}>
                                수정
                            </Button>,
                            <Button type="link" danger onClick={() => handleDelete(comment.id)}>
                                삭제
                            </Button>
                        ]}
                    >
                        <List.Item.Meta
                            description={
                                <div>
                                    <p style={{ marginBottom: "8px" }}>{comment.commentContent}</p>
                                    <p style={{ fontSize: "0.9em", color: "#999", margin: 0 }}>
                                        작성 시각: {new Date(comment.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
        </div>
    );
};

export default Comment;
