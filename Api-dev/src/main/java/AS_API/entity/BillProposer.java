package AS_API.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "BillProposer")
@Getter
@NoArgsConstructor
public class BillProposer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long proposerId;

    @Column(nullable = false, length = 255)
    private String proposerName;

    @Column(nullable = true)
    private String bth;

    @Column(nullable = true, length = 255)
    private String job;

    @Column(nullable = true, length = 255)
    private String poly;

    @Column(nullable = true, length = 255)
    private String orig;

    @Column(nullable = true, length = 255)
    private String cmits;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String memTitle;

    @OneToMany(mappedBy = "proposer", cascade = CascadeType.ALL)
    private List<Bill> bills;

    @OneToMany(mappedBy = "proposer", cascade = CascadeType.ALL)
    private List<BillStatus> billStatuses;
}
