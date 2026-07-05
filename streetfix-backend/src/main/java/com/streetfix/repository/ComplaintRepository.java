package com.streetfix.repository;

import com.streetfix.entity.Complaint;
import com.streetfix.enums.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByStatus(ComplaintStatus status);
    List<Complaint> findByCategory(String category);
    List<Complaint> findByCitizenId(Long citizenId);
    List<Complaint> findByAssetCode(String assetCode);
}
