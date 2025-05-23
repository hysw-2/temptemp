package AS_API.dto;

import lombok.Builder;

public class CommentRequestDto {

    private final Long postId;
    private final Long parentCommentId;
    private final Long userId2;
    private final String commentContent;

    @Builder
    public CommentRequestDto(Long postId, Long parentCommentId, Long userId2, String commentContent) {
        this.postId = postId;
        this.parentCommentId = parentCommentId;
        this.userId2 = userId2;
        this.commentContent = commentContent;
    }

    public Long getPostId() { return postId; }
    public Long getParentCommentId() { return parentCommentId; }
    public Long getUserId2() { return userId2; }
    public String getCommentContent() { return commentContent; }
}
