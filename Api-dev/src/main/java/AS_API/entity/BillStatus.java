package AS_API.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "BillStatus")
@NoArgsConstructor
@Getter
public class BillStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long documentId;

    @OneToOne
    @JoinColumn(name = "billId", nullable = false)
    private Bill bill;

    @ManyToOne
    @JoinColumn(name = "proposerId", nullable = false)
    private BillProposer proposer;

    @Column(nullable = false)
    private int billCount;

    @Column(nullable = true, length = 500)
    private String link;

    @Column(nullable = false)
    private int yes;

    @Column(nullable = false)
    private int no;

    @Column(nullable = false)
    private int bookmarkCount;
}
