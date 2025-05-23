package AS_API.dto;

import lombok.Builder;

import java.time.LocalDateTime;

public class PostResponseDto {

    private final Long postId;
    private final Long parentPostId;
    private final Long userId;
    private final String postTitle;
    private final String content;
    private final int postCount;
    private final LocalDateTime postDate;

    @Builder
    public PostResponseDto(Long postId, Long parentPostId, Long userId,
                           String postTitle, String content, int postCount, LocalDateTime postDate) {
        this.postId = postId;
        this.parentPostId = parentPostId;
        this.userId = userId;
        this.postTitle = postTitle;
        this.content = content;
        this.postCount = postCount;
        this.postDate = postDate;
    }

    public Long getPostId() { return postId; }
    public Long getParentPostId() { return parentPostId; }
    public Long getUserId() { return userId; }
    public String getPostTitle() { return postTitle; }
    public String getContent() { return content; }
    public int getPostCount() { return postCount; }
    public LocalDateTime getPostDate() { return postDate; }
}
