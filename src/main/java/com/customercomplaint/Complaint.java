package com.customercomplaint;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    private String complaintId;

    private String complaintText;
    private String category;
    private String sentiment;
    private String priority;
    private String date;

    public Complaint() {
    }

    public Complaint(String complaintId, String complaintText, String category,
                     String sentiment, String priority, String date) {
        this.complaintId = complaintId;
        this.complaintText = complaintText;
        this.category = category;
        this.sentiment = sentiment;
        this.priority = priority;
        this.date = date;
    }

    public String getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(String complaintId) {
        this.complaintId = complaintId;
    }

    public String getComplaintText() {
        return complaintText;
    }

    public void setComplaintText(String complaintText) {
        this.complaintText = complaintText;
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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}