package com.vhub.smartplacement.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vhub.smartplacement.dto.CreateTestStudentRequest;
import com.vhub.smartplacement.entity.TestStudent;
import jakarta.validation.Valid;
import com.vhub.smartplacement.repository.TestStudentRepository;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;


@RestController
@RequestMapping("/api/test-students")
public class TestStudentController {
    private final TestStudentRepository testStudentRepository;

    public TestStudentController(TestStudentRepository testStudentRepository) {
        this.testStudentRepository = testStudentRepository;
    }

    @PostMapping
    public TestStudent createStudent (
            @Valid @RequestBody CreateTestStudentRequest request
    ) {
        TestStudent student = toTestStudent(request);

        return testStudentRepository.save(student);
    }

    private TestStudent toTestStudent(CreateTestStudentRequest request) {
        return new TestStudent (
                request.getName(),
                request.getEmail()
        );
    }

    @GetMapping
    public List<TestStudent> getAllStudents() {
        return testStudentRepository.findAll();
    }
}