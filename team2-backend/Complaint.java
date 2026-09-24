package com.customercomplaint.backend;

import java.time.LocalDateTime;

public class Complaint {

    private Long id;
    private String customerName;
    private String category;
    private String sentiment;
    private String priority;
    private String description;
    private LocalDateTime createdAt;

    public Complaint() {
        this.createdAt = LocalDateTime.now();
    }

    public Complaint(Long id, String customerName, String category, String sentiment,
                    String priority, String description) {
        this.id = id;
        this.customerName = customerName;
        this.category = category;
        this.sentiment = sentiment;
        this.priority = priority;
        this.description = description;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSentiment() {
        return sentiment;
    }

    public void setSentiment(String sentiment) {
        this.sentiment = sentiment;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
