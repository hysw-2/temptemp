package AS_API.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String targetType;          // "USER" 또는 "POST"
    private String reason;              // 신고 사유
    private LocalDateTime createdAt;    // 신고 시간

    @ManyToOne
    @JoinColumn(name = "reporter_id", referencedColumnName = "user_id")
    private User reporter;              // 신고한 사람

    @ManyToOne
    @JoinColumn(name = "target_id", referencedColumnName = "user_id")
    private User target;                // 신고 대상
}
