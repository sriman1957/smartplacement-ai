package com.vhub.smartplacement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "test_students")
public class TestStudent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
     /* it is a wrapper class not a primitive datatype
     regualar primitive datatype cannot hold null -> it is initialized to null
     but Long is a wrapper class and it can hold (null) value also */

    private String name;

    private String email;

    protected TestStudent() {
    }

    public TestStudent(String name, String email) {
       this.name = name;
       this.email = email;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

}