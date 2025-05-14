import React from 'react';
import {Form, Input, Button, message, Card, Modal} from 'antd';
import registerAPI from '../api/integrated/registerAPI';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        const res = await registerAPI(values);
        console.log("DEBUG res:", res);
        if (res?.status === 201 || res?.status === 200) {
            Modal.success({
                title: "회원가입 완료",
                content: "회원가입이 성공적으로 완료되었습니다.",
                onOk: () => navigate("/"),
            });
        } else {
            switch (res.body?.code) {
                case 'UE1':
                    message.error('잘못된 이메일 형식입니다.');
                    break;
                case 'UE2':
                    message.error('잘못된 비밀번호 형식입니다.');
                    break;
                case 'UE3':
                    message.error('잘못된 입력입니다.');
                    break;
                case 'UE5':
                    message.error('회원가입에 실패했습니다.');
                    break;
                default:
                    message.error('알 수 없는 오류가 발생했습니다.');
            }
        }
    };

    return (
        <Card title="회원가입" style={{ width: 400, margin: 'auto', marginTop: '100px' }}>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item name="uid" label="아이디" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="name" label="이름" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="비밀번호" rules={[{ required: true, min: 10, message: '10자 이상 입력해주세요.' }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item name="phoneNumber" label="전화번호" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="이메일" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="nickName" label="닉네임" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        회원가입
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default SignupPage;