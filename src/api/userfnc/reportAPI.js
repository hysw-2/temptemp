import apiClient from "../apiClient";

/**
 * 게시글 신고 요청
 * @param {number} postId - 신고 대상 게시글 ID
 * @param {string} reason - 신고 사유
 */
export const reportPost = async (postId, reason) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const payload = {
      targetId: postId,
      targetType: "POST",
      reason: reason,
    };

    console.log("신고 요청 payload (POST):", payload);

    const response = await apiClient.post("/report/create", payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("게시글 신고 중 오류:", error);
    if (error.response?.status === 404) {
      throw new Error("해당하는 사용자가 없습니다.");
    }
    throw error;
  }
};

/**
 * 댓글 신고 요청
 * @param {number} commentId - 신고 대상 댓글 ID
 * @param {string} reason - 신고 사유
 */
export const reportComment = async (commentId, reason) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("로그인이 필요합니다.");
    }

    const payload = {
      targetId: commentId,
      targetType: "COMMENT",
      reason: reason,
    };

    console.log("신고 요청 payload (COMMENT):", payload);

    const response = await apiClient.post("/report/create", payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("댓글 신고 중 오류:", error);
    if (error.response?.status === 404) {
      throw new Error("해당하는 사용자가 없습니다.");
    }
    throw error;
  }
};
