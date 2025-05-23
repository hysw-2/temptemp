package AS_API.dto;

import lombok.Builder;

public class PostRequestDto {

    private final Long parentPostId;
    private final Long userId;
    private final String postTitle;
    private final String content;

    @Builder
    public PostRequestDto(Long parentPostId, Long userId, String postTitle, String content) {
        this.parentPostId = parentPostId;
        this.userId = userId;
        this.postTitle = postTitle;
        this.content = content;
    }

    public Long getParentPostId() { return parentPostId; }
    public Long getUserId() { return userId; }
    public String getPostTitle() { return postTitle; }
    public String getContent() { return content; }
}
