package com.customercomplaint;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DatabaseService {

    private final ComplaintRepository complaintRepository;

    public DatabaseService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
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