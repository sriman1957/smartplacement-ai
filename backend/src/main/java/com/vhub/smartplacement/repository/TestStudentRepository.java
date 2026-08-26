package com.vhub.smartplacement.repository;

import com.vhub.smartplacement.entity.TestStudent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestStudentRepository extends JpaRepository<TestStudent, Long> {
}