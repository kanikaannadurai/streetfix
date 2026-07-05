package com.streetfix.repository;

import com.streetfix.entity.EscalationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EscalationLogRepository extends JpaRepository<EscalationLog, Long> {
    List<EscalationLog> findByComplaintIdOrderByEscalatedAtDesc(Long complaintId);
    long countByComplaintId(Long complaintId);
}
