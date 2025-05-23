import React from "react";

const Comment = ({ comment }) => {
    return (
        <div style={{ padding: "10px 20px", borderBottom: "1px solid #eee" }}>
            <p>{comment.commentText}</p>
            <p style={{ fontSize: "0.9em", color: "#999" }}>
                작성 시각: {new Date(comment.createdAt).toLocaleString()}
            </p>
        </div>
    );
};

export default Comment;
