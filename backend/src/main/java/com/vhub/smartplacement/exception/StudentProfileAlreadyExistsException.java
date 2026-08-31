package com.vhub.smartplacement.exception;

public class StudentProfileAlreadyExistsException extends RuntimeException {
    public StudentProfileAlreadyExistsException (String message) {
        super(message);
    }
}