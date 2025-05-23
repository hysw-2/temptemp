import React, { useState } from "react";
import { Input, Button, message, List, Card } from "antd";
import { createPost } from "../api/userfnc/postAPI";
import { createComment } from "../api/userfnc/commentAPI";
import { searchBills } from "../api/userfnc/searchAPI";
import Comment from "../components/Comment";
import UserHeader from "../components/Header";
import QuickMenu from "../components/QuickMenu";

const Discussion = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [discussionText, setDiscussionText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [discussion, setDiscussion] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const results = await searchBills("billTitle", searchQuery);
      setSearchResults(results.content); 
    } catch (err) {
      message.error("법안 검색 실패");
    }
  };

  const handlePostSubmit = async () => {
    if (!selectedBill) return message.warning("법안을 먼저 선택하세요.");
    if (!discussionText.trim()) return message.warning("내용을 입력하세요.");
    try {
      const response = await createPost(selectedBill.billId, discussionText);
      setDiscussion(response);
      message.success("게시글 등록 완료");
    } catch (err) {
      message.error("게시글 등록 실패");
    }
  };

  const handleCommentSubmit = async () => {
    if (!discussion) return;
    if (!commentText.trim()) return;
    try {
      await createComment(discussion.discussionId, commentText);
      message.success("댓글 등록 완료");
      setCommentText("");
    } catch (err) {
      message.error("댓글 등록 실패");
    }
  };

  return (
    <div>
    <UserHeader />
    <div style={{ padding: "20px" }}>
      <h2>법안 검색</h2>
      <Input.Search
        placeholder="법안 제목으로 검색"
        enterButton="검색"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onSearch={handleSearch}
        style={{ marginBottom: "16px", width: "400px" }}
      />
      <List
        dataSource={searchResults}
        renderItem={(item) => (
          <Card
            hoverable
            onClick={() => {
              setSelectedBill(item);
              setSearchResults([]);
              setSearchQuery("");
            }}
            style={{ marginBottom: "10px" }}
          >
            <h3>{item.billTitle}</h3>
            <p>안건번호: {item.billNumber}</p>
            <p>발의자: {item.billProposer}</p>
          </Card>
        )}
      />

      {selectedBill && (
        <div style={{ marginTop: "20px" }}>
          <h3>선택된 법안: {selectedBill.billTitle}</h3>
          <Input.TextArea
            rows={4}
            value={discussionText}
            onChange={(e) => setDiscussionText(e.target.value)}
            placeholder="의견을 입력하세요"
          />
          <Button type="primary" onClick={handlePostSubmit} style={{ marginTop: "10px" }}>
            게시글 작성
          </Button>
        </div>
      )}

      {discussion && (
        <div style={{ marginTop: "30px" }}>
          <h3>게시글</h3>
          <Card>
            <p>{discussion.discussionText}</p>
          </Card>

          <h4 style={{ marginTop: "20px" }}>댓글 작성</h4>
          <Input.TextArea
            rows={2}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="댓글을 입력하세요"
          />
          <Button type="primary" onClick={handleCommentSubmit} style={{ marginTop: "10px" }}>
            댓글 작성
          </Button>

          <Comment postId={discussion.discussionId} />
        </div>
      )}
    </div>
    <QuickMenu/>
    </div>
  );
};

export default Discussion;
