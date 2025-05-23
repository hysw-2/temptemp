package AS_API.dto;

import lombok.Builder;

import java.time.LocalDateTime;

public class CommentResponseDto {

    private final Long commentId;
    private final Long postId;
    private final Long parentCommentId;
    private final Long userId2;
    private final String commentContent;
    private final LocalDateTime createdAt;

    @Builder
    public CommentResponseDto(Long commentId, Long postId, Long parentCommentId,
                              Long userId2, String commentContent, LocalDateTime createdAt) {
        this.commentId = commentId;
        this.postId = postId;
        this.parentCommentId = parentCommentId;
        this.userId2 = userId2;
        this.commentContent = commentContent;
        this.createdAt = createdAt;
    }

    public Long getCommentId() { return commentId; }
    public Long getPostId() { return postId; }
    public Long getParentCommentId() { return parentCommentId; }
    public Long getUserId2() { return userId2; }
    public String getCommentContent() { return commentContent; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
