package com.customercomplaint;

import java.time.Instant;

public class CustomerComplaintResponse {

    private String id;
    private String status;
    private String complaintText;
    private String message;
    private Instant createdAt;

    public CustomerComplaintResponse() {
    }

    public CustomerComplaintResponse(String id, String status, String complaintText, String message, Instant createdAt) {
        this.id = id;
        this.status = status;
        this.complaintText = complaintText;
        this.message = message;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getComplaintText() {
        return complaintText;
    }

    public void setComplaintText(String complaintText) {
        this.complaintText = complaintText;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
