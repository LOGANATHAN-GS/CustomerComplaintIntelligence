package com.customercomplaint.backend;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

@Service
public class ComplaintService {

    private final Map<Long, Complaint> complaints = new ConcurrentHashMap<>();
    private final AtomicLong sequence = new AtomicLong(1L);

    public List<Complaint> getAllComplaints() {
        return new ArrayList<>(complaints.values());
    }

    public Optional<Complaint> getComplaintById(Long id) {
        return Optional.ofNullable(complaints.get(id));
    }

    public Complaint createComplaint(Complaint complaint) {
        Long id = sequence.getAndIncrement();
        complaint.setId(id);
        complaints.put(id, complaint);
        return complaint;
    }
}
