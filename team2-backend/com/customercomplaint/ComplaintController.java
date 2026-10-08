package com.customercomplaint;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/complaints", "/complaints"})
public class ComplaintController {

    private final ComplaintService complaintService;
    private final ComplaintRepository complaintRepository;

    public ComplaintController(
            ComplaintService complaintService,
            ComplaintRepository complaintRepository) {

        this.complaintService = complaintService;
        this.complaintRepository = complaintRepository;
    }

    @PostMapping({"/analyze", ""})
    public Complaint analyzeComplaint(
            @RequestBody(required = false) Complaint complaint) {

        return complaintService.processComplaint(complaint);
    }

    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }
}