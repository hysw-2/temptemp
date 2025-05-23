import React, { useEffect, useState } from "react";
import {Card, Typography, Form, Input, Avatar, Button, message, Divider, Popconfirm, Modal} from "antd";
import { UserOutlined } from "@ant-design/icons";
import updateProfileAPI from "../api/mypage/updateProfileAPI";
import deleteUserAPI from "../api/integrated/deleteUserAPI";

const { Title, Text } = Typography;

const MyPage = () => {
    const [form] = Form.useForm();
    const nickName = localStorage.getItem("nickName");
    const name = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmName, setConfirmName] = useState("");

    useEffect(() => {
        form.setFieldsValue({ newNickName: nickName });
    }, [nickName, form]);

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();

            const payload = {
                currentPassword: values.currentPassword,
                ...(values.newPassword && { newPassword: values.newPassword }),
                ...(values.newNickName && { newNickName: values.newNickName }),
            };

            const res = await updateProfileAPI(payload);

            if (res.status === 200) {
                message.success("프로필이 수정되었습니다.");
                if (payload.newNickName) {
                    localStorage.setItem("username", payload.newNickName);
                }
            } else {
                message.error(res.message || "수정 실패");
            }
        } catch (err) {
            console.error("폼 유효성 오류:", err);
        }
    };

    const showDeleteConfirm = () => {
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (confirmName !== name) {
            message.error("이름이 일치하지 않습니다.");
            return;
        }

        const res = await deleteUserAPI(userId);
        if (res.status === 200) {
            message.success("회원탈퇴가 완료되었습니다.");
            localStorage.clear();
            window.location.href = "/";
        } else {
            message.error(res.message || "회원탈퇴 실패");
        }
    };

    return (
        <Card title="프로필 관리" style={{ maxWidth: 600, margin: "50px auto" }}>
            <div style={styles.profileHeader}>
                <Avatar size={64} icon={<UserOutlined />} />
                <div style={{ marginLeft: 20 }}>
                    <Title level={5}>{name}</Title>
                    <Text>{nickName}</Text><br />
                    <Text type="secondary">{email}</Text>
                </div>
            </div>

            <Divider />

            <Form form={form} layout="vertical">
                <Form.Item label="이름">
                    <Input value={name} disabled />
                </Form.Item>

                <Form.Item
                    name="newNickName"
                    label="닉네임"
                    rules={[{ required: true, message: "닉네임을 입력하세요" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="currentPassword"
                    label="현재 비밀번호"
                    rules={[{ required: true, message: "현재 비밀번호는 필수입니다" }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    label="새 비밀번호"
                    rules={[{ min: 10, message: "비밀번호는 10자 이상이어야 합니다" }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" onClick={handleUpdate} block>
                        수정하기
                    </Button>
                </Form.Item>
            </Form>

            <Divider />
            <Button danger block onClick={showDeleteConfirm}>
                회원탈퇴
            </Button>
            <Modal
                title="회원탈퇴 확인"
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    setConfirmName("");
                }}
                onOk={handleDelete}
                okText="탈퇴"
                cancelText="취소"
            >
                <p>회원탈퇴를 하시려면 이름(<strong>{name}</strong>)을 정확히 입력해주세요.</p>
                <Input
                    placeholder="이름 입력"
                    value={confirmName}
                    onChange={(e) => setConfirmName(e.target.value)}
                />
            </Modal>

        </Card>
    );
};

const styles = {
    profileHeader: {
        display: "flex",
        alignItems: "center",
        marginBottom: 24,
    },
};

export default MyPage;
