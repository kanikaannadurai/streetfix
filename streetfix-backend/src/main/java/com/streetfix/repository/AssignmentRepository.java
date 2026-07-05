package com.streetfix.repository;

import com.streetfix.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByOfficerId(Long officerId);
    List<Assignment> findByWorkerId(Long workerId);
    List<Assignment> findByComplaintId(Long complaintId);
}
