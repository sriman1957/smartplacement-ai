package com.vhub.smartplacement.repository;

import com.vhub.smartplacement.entity.Resume;
import com.vhub.smartplacement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByUser(User user);

    Optional<Resume> findByIdAndUser(Long id, User user);
}