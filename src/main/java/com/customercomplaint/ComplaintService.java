package com.customercomplaint;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    public Complaint processComplaint(Complaint complaint) {

        if (complaint == null) {
            throw new IllegalArgumentException("Complaint cannot be null");
        }

        if (complaint.getComplaintText() == null ||
                complaint.getComplaintText().trim().isEmpty()) {
            throw new IllegalArgumentException("Complaint text cannot be empty");
        }

        return complaintRepository.save(complaint);
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