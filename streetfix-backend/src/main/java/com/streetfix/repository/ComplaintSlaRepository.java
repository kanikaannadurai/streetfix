package com.streetfix.repository;

import com.streetfix.entity.ComplaintSla;
import com.streetfix.enums.EscalationLevel;
import com.streetfix.enums.SlaStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintSlaRepository extends JpaRepository<ComplaintSla, Long> {

    Optional<ComplaintSla> findByComplaintId(Long complaintId);

    /** Fetch all active SLAs that have not yet been breached */
    List<ComplaintSla> findByStatus(SlaStatus status);

    /** Find all SLAs where due date has passed and still marked ACTIVE or WARNING */
    @Query("SELECT cs FROM ComplaintSla cs WHERE cs.dueDate < :now " +
           "AND cs.status IN (com.streetfix.enums.SlaStatus.ACTIVE, com.streetfix.enums.SlaStatus.WARNING)")
    List<ComplaintSla> findBreachedSlas(@Param("now") LocalDateTime now);

    /** Find SLAs approaching warning threshold */
    @Query("SELECT cs FROM ComplaintSla cs WHERE cs.dueDate BETWEEN :now AND :warningTime " +
           "AND cs.status = com.streetfix.enums.SlaStatus.ACTIVE")
    List<ComplaintSla> findSlasDueForWarning(@Param("now") LocalDateTime now,
                                              @Param("warningTime") LocalDateTime warningTime);

    /** Find active SLAs older than N days for escalation checks */
    @Query("SELECT cs FROM ComplaintSla cs WHERE cs.createdAt < :threshold " +
           "AND cs.status IN (com.streetfix.enums.SlaStatus.ACTIVE, com.streetfix.enums.SlaStatus.WARNING, com.streetfix.enums.SlaStatus.BREACHED) " +
           "AND cs.escalationLevel = :currentLevel")
    List<ComplaintSla> findByAgeAndEscalationLevel(@Param("threshold") LocalDateTime threshold,
                                                    @Param("currentLevel") EscalationLevel currentLevel);
}
