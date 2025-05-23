package AS_API.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "BillVote", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "bill_id"})})
@Getter
@NoArgsConstructor
public class BillVote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "bill_id")
    private Bill bill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VoteType voteType;

    public BillVote(User user, Bill bill, VoteType voteType) {
        this.user = user;
        this.bill = bill;
        this.voteType = voteType;
    }

    public void setVoteType(VoteType voteType) {
        this.voteType = voteType;
    }

    public enum VoteType {
        YES, NO
    }
}
