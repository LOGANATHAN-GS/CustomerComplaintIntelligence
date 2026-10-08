package com.customercomplaint;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ComplaintController {

    private final ComplaintService complaintService;
    private final ComplaintRepository complaintRepository;

    public ComplaintController(
            ComplaintService complaintService,
            ComplaintRepository complaintRepository) {

        this.complaintService = complaintService;
        this.complaintRepository = complaintRepository;
    }

    @PostMapping({"/api/complaints/analyze", "/complaints/analyze", "/api/complaints", "/complaints"})
    public Complaint analyzeComplaint(
            @RequestBody(required = false) Complaint complaint) {

        return complaintService.processComplaint(complaint);
    }

    @GetMapping({"/api/complaints/{id}", "/complaints/{id}"})
    public ResponseEntity<Complaint> getComplaintById(@PathVariable("id") String id) {
        return complaintService.getComplaintById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping({"/api/complaints", "/complaints"})
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @GetMapping({"/api/customer/complaints/{id}", "/customer/complaints/{id}"})
    public ResponseEntity<CustomerComplaintResponse> getCustomerComplaintById(@PathVariable("id") String id) {
        return complaintService.getComplaintById(id)
                .map(complaint -> ResponseEntity.ok(new CustomerComplaintResponse(
                        complaint.getId(),
                        complaint.getStatus(),
                        complaint.getComplaintText(),
                        "Your complaint has been received and is currently under review.",
                        complaint.getCreatedAt()
                )))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}