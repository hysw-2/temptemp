import apiClient from "../apiClient";

export const createComment = async (postId, commentText) => {
    const response = await apiClient.post("/comments", {
        postId,
        commentText,
    });
    return response.data;
};
