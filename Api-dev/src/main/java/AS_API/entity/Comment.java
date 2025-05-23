package AS_API.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long commentId;

    private Long postId;

    private Long parentCommentId;  // null이면 최상위 댓글

    private Long userId2;

    @Column(columnDefinition = "TEXT")
    private String commentContent;

    private LocalDateTime createdAt;
}
