package com.vhub.smartplacement.exception;

public class StudentProfileNotFoundException extends RuntimeException {

    public StudentProfileNotFoundException (String message) {
        super(message);
    }
}