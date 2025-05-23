package AS_API.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Bill")
@Getter
@NoArgsConstructor
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long billId;

    @ManyToOne
    @JoinColumn(name = "proposerId", nullable = false)
    private BillProposer proposer;

    @Column(nullable = false, length = 255)
    private String apiId;

    @Column(nullable = false)
    private Long billNumber;

    @Column(nullable = true, length = 255)
    private String billTitle;

    @Column(nullable = true, length = 255)
    private String billProposer;

    @Column(nullable = true, length = 255)
    private String committee;

    @Column(nullable = true, length = 255)
    private String billStatus;

    @Column(nullable = true)
    private LocalDateTime billDate;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String detail;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String prediction;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String term;

    @OneToOne(mappedBy = "bill", cascade = CascadeType.ALL)
    private BillStatus billStatusDetail;
}
