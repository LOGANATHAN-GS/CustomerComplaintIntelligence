
package com.customercomplaint;

import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.customercomplaint.core.ComplaintPreprocessor;
import com.customercomplaint.core.ComplaintClassifier;
import com.customercomplaint.core.SentimentAnalyzer;
import com.customercomplaint.core.PriorityDetector;

import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    public Complaint processComplaint(Complaint complaint) {

        if (complaint == null || complaint.getComplaintText() == null ||
            complaint.getComplaintText().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "complaintText is required");
        }

        String text = ComplaintPreprocessor.cleanText(complaint.getComplaintText());
        String category = ComplaintClassifier.classify(text);
        String sentiment = SentimentAnalyzer.analyze(text);
        String priority = PriorityDetector.detect(text, sentiment);

        complaint.setCategory(category);
        complaint.setSentiment(sentiment);
        complaint.setPriority(priority);
        complaint.setConfidenceScore("Other".equals(category) ? 0.72 : 0.90);
        complaint.setActionRecommended(recommendedAction(category, priority));
        complaint.setDraftReply("Dear Customer, we are sorry to hear about your " +
                category.toLowerCase() + " concern. Our team will review it and " +
                "follow up with you as soon as possible.");
        complaint.setStatus("RECEIVED");
        complaint.ensureIdAndTimestamp();

        return complaintRepository.save(complaint);
    }

    private String recommendedAction(String category, String priority) {
        if ("High".equals(priority)) {
            return "Escalate this complaint to the appropriate support team immediately.";
        }
        return switch (category) {
            case "Payment" -> "Review the transaction record and resolve any billing discrepancy.";
            case "Delivery" -> "Check the shipment status and contact the delivery partner.";
            case "Refund" -> "Review refund eligibility and update the customer on the outcome.";
            case "Account" -> "Verify the account issue and guide the customer through recovery.";
            case "Product" -> "Review the product issue and arrange a replacement or repair if needed.";
            default -> "Assign the complaint to customer support for review.";
        };
    }

    public Complaint saveComplaint(Complaint complaint) {
        return complaintRepository.save(complaint);
    }

    public Optional<Complaint> getComplaintById(String complaintId) {
        return complaintRepository.findById(complaintId);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public long getComplaintCount() {
        return complaintRepository.count();
    }

    public void deleteComplaint(String complaintId) {
        complaintRepository.deleteById(complaintId);
    }
}

