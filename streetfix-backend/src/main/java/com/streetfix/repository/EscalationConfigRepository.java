package com.streetfix.repository;

import com.streetfix.entity.EscalationConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EscalationConfigRepository extends JpaRepository<EscalationConfig, Long> {
    Optional<EscalationConfig> findByLevel(Integer level);
    List<EscalationConfig> findAllByOrderByLevelAsc();
}
