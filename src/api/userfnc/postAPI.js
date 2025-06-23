import apiClient from "../apiClient";

export const createPost = async (discussionTitle, discussionText) => {
    const response = await apiClient.post("/posts", {
        postTitle: discussionTitle,
        content: discussionText
    });
    return response.data;
};

export const deletePost = async (postId) => {
    const response = await apiClient.delete(`/posts/${postId}`);
    return response.data;
};

export const editPost = async (postId, discussionTitle, discussionText) => {
    const response = await apiClient.put(`/posts/${postId}`, {
        postTitle: discussionTitle,
        content: discussionText
    });
    return response.data;
};

export const getAllPosts = async () => {
    const response = await apiClient.get("/posts");
    return response.data;
};

export const getPostById = async (postId) => {
    const response = await apiClient.get(`/posts/${postId}`);
    return response.data;
};

export const reportPost = async (targetId, reason) => {
    const uid = localStorage.getItem("uid");
    const response = await apiClient.post('/report/create', {
        uid,
        targetId,
        targetType: 'POST',
        reason,
    });
    return response.data;
};
