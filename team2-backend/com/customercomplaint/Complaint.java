package com.customercomplaint;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    private String id;
    private String complaintText;
    private String category;
    private String sentiment;
    private String priority;
    private double confidenceScore;
    private String actionRecommended;
    private String draftReply;
    private Instant createdAt;

    public Complaint() {
    }

    public void ensureIdAndTimestamp() {
        if (id == null || id.isBlank()) {
            id = "C" + UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getComplaintText() { return complaintText; }
    public void setComplaintText(String complaintText) { this.complaintText = complaintText; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSentiment() { return sentiment; }
    public void setSentiment(String sentiment) { this.sentiment = sentiment; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(double confidenceScore) { this.confidenceScore = confidenceScore; }
    public String getActionRecommended() { return actionRecommended; }
    public void setActionRecommended(String actionRecommended) { this.actionRecommended = actionRecommended; }
    public String getDraftReply() { return draftReply; }
    public void setDraftReply(String draftReply) { this.draftReply = draftReply; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
