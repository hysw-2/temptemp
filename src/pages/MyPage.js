import React, { useEffect } from "react";
import { Card, Typography, Form, Input, Avatar,Button, message, Divider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import updateProfileAPI from "../api/mypage/updateProfileAPI";

const { Title, Text } = Typography;

const MyPage = () => {
    const [form] = Form.useForm();
    const nickName = localStorage.getItem("nickName");
    const name = localStorage.getItem("username");
    const email = localStorage.getItem("email");

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
