package com.customercomplaint;

import org.springframework.stereotype.Service;

@Service
public class ComplaintService {

    public Complaint processComplaint(Complaint complaint) {

        if (complaint == null) {
            throw new IllegalArgumentException("Complaint cannot be null");
        }

        if (complaint.getComplaintText() == null ||
            complaint.getComplaintText().trim().isEmpty()) {
            throw new IllegalArgumentException("Complaint text cannot be empty");
        }

        return complaint;
    }
}
