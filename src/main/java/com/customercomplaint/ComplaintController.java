package com.customercomplaint;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    public Complaint createComplaint(@RequestBody Complaint complaint) {
        return complaintService.processComplaint(complaint);
    }

    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintService.getAllComplaints();
    }

    @GetMapping("/{id}")
    public Optional<Complaint> getComplaintById(@PathVariable String id) {
        return complaintService.getComplaintById(id);
    }

    @GetMapping("/count")
    public long getComplaintCount() {
        return complaintService.getComplaintCount();
    }

    @DeleteMapping("/{id}")
    public String deleteComplaint(@PathVariable String id) {
        complaintService.deleteComplaint(id);
        return "Complaint deleted successfully";
    }
}