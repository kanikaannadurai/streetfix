package com.streetfix.repository;

import com.streetfix.entity.Complaint;
import com.streetfix.enums.ComplaintStatus;
import com.streetfix.enums.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByStatus(ComplaintStatus status);
    List<Complaint> findByCategory(String category);
    List<Complaint> findByCitizenId(Long citizenId);
    List<Complaint> findByAssetCode(String assetCode);
    List<Complaint> findByPriority(Priority priority);
    long countByStatus(ComplaintStatus status);
    long countByCategory(String category);
    long countByPriority(Priority priority);
    List<Complaint> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);
    long countByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    @Query("SELECT c.category, COUNT(c) FROM Complaint c GROUP BY c.category")
    List<Object[]> countGroupByCategory();

    @Query("SELECT c.priority, COUNT(c) FROM Complaint c GROUP BY c.priority")
    List<Object[]> countGroupByPriority();

    @Query("SELECT c.status, COUNT(c) FROM Complaint c GROUP BY c.status")
    List<Object[]> countGroupByStatus();
}
