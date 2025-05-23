package AS_API.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;

    private Long parentPostId;  // null이면 최상위 글

    private Long userId;

    private String postTitle;

    @Column(columnDefinition = "TEXT")
    private String content;

    private int postCount;

    private LocalDateTime postDate;

    public void increaseViewCount() {
        this.postCount += 1;
    }
}
