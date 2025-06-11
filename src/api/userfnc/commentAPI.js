import apiClient from "../apiClient";

export const createComment = async (postId, commentContent, parentCommentId = null) => {
    const payload = parentCommentId
      ? { postId, commentContent, parentCommentId }
      : { postId, commentContent };
  
    const response = await apiClient.post(`/comments`, payload);
    return response.data;
  };

export const deleteComment = async (commentId) => {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
};

export const editComment = async (commentId, commentContent) => {
    const response = await apiClient.put(`/comments/${commentId}`, {
        commentContent,
    });
    return response.data;
};

export const getCommentsByPostId = async (postId) => {
    const response = await apiClient.get(`/comments/${postId}`);
    return response.data;
};
