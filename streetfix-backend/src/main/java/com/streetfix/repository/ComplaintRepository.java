package com.streetfix.repository;

import com.streetfix.entity.Complaint;
import com.streetfix.enums.ComplaintStatus;
import com.streetfix.enums.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long>, JpaSpecificationExecutor<Complaint> {
    Page<Complaint> findByStatus(ComplaintStatus status, Pageable pageable);
    List<Complaint> findByStatus(ComplaintStatus status);
    
    Page<Complaint> findByCategory(String category, Pageable pageable);
    List<Complaint> findByCategory(String category);
    
    Page<Complaint> findByCitizenId(Long citizenId, Pageable pageable);
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
