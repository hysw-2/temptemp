import apiClient from "../apiClient";

export const createPost = async (billId, discussionText) => {
    const response = await apiClient.post("/posts", {
        billId,
        discussionText,
    });
    return response.data;
};
