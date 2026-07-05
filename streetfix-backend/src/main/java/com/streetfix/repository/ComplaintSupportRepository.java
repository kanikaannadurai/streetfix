package com.streetfix.repository;

import com.streetfix.entity.ComplaintSupport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ComplaintSupportRepository extends JpaRepository<ComplaintSupport, Long> {
    Optional<ComplaintSupport> findByComplaintIdAndCitizenId(Long complaintId, Long citizenId);
    long countByComplaintId(Long complaintId);
}
