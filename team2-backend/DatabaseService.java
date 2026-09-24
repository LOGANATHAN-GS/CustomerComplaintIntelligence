package com.customercomplaint.backend;

import org.springframework.stereotype.Service;

@Service
public class DatabaseService {

    public String healthCheck() {
        return "Database is connected and ready.";
    }
}
