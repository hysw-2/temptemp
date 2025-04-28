import React, { useState } from 'react';
import { Avatar, Input, Button, List, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

const Comment = ({ comments = [], onAddComment }) => {
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (!comment.trim()) return;
        onAddComment(comment);
        setComment('');
    };

    const formatDateTime = (dateTimeString) => {
        try {
            const date = new Date(dateTimeString);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }
            return {
                date: date.toLocaleDateString('ko-KR'),
                time: date.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                })
            };
        } catch (error) {
            console.error('Date parsing error:', error);
            return {
                date: '날짜 정보 없음',
                time: ''
            };
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.commentInput}>
                <Avatar icon={<UserOutlined />} />
                <TextArea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    style={styles.textArea}
                />
                <Button
                    type="primary"
                    onClick={handleSubmit}
                    disabled={!comment.trim()}
                    style={styles.submitButton}
                >
                    댓글 작성
                </Button>
            </div>
            <List
                dataSource={comments}
                header={`Comments: ${comments.length}`}
                itemLayout="horizontal"
                renderItem={(item) => {
                    const { date, time } = formatDateTime(item.date);
                    return (
                        <List.Item style={styles.commentItem}>
                            <div style={styles.commentWrapper}>
                                <div style={styles.commentHeader}>
                                    <Avatar icon={<UserOutlined />} style={styles.avatar} />
                                    <div style={styles.commentInfo}>
                                        <Text strong>{item.author}</Text>
                                        <div style={styles.dateTime}>
                                            <Text type="secondary">{date}</Text>
                                            <Text type="secondary" style={styles.time}>{time}</Text>
                                        </div>
                                    </div>
                                </div>
                                <div style={styles.commentContent}>
                                    <Text>{item.content}</Text>
                                </div>
                            </div>
                        </List.Item>
                    );
                }}
            />
        </div>
    );
};

const styles = {
    container: {
        marginTop: '20px',
    },
    commentInput: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
    },
    textArea: {
        flex: 1,
    },
    submitButton: {
        alignSelf: 'flex-end',
    },
    commentItem: {
        padding: '12px 0',
        borderBottom: '1px solid #f0f0f0',
    },
    commentWrapper: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    commentHeader: {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '8px',
        width: '100%',
    },
    avatar: {
        marginRight: '12px',
        flexShrink: 0,
    },
    commentInfo: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '150px',
    },
    dateTime: {
        display: 'flex',
        gap: '8px',
        fontSize: '12px',
    },
    time: {
        color: '#999',
    },
    commentContent: {
        marginLeft: '40px',
        textAlign: 'left',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        width: '100%',
        maxWidth: '100%',
    },
};

export default Comment; 