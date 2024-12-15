package com.myrh.controllers;

import com.myrh.dto.OfferRequest;
import com.myrh.models.Offer;
import com.myrh.services.OfferService;
import com.myrh.utils.Enum;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("offer")
public class OfferController {

    private final OfferService offerService;

    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }

    @GetMapping("all")
    public ResponseEntity<Object> getAllOffers() {
        return ResponseEntity.ok(offerService.listAll());
    }

    @GetMapping("{id}")
    public ResponseEntity<Object> getOfferById(@PathVariable Long id) {
        Offer offer = offerService.getOfferById(id);
        if (offer != null) {
            return ResponseEntity.ok(offer);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("create")
    public ResponseEntity<String> createOffer(@Valid @RequestBody OfferRequest req) {
        Offer offer = new Offer(
                req.getTitle(),
                req.getDescription(),
                req.getLocation(),
                req.getDegree(),
                req.getSalary(),
                req.getProfileId(),
                req.getCompanyId()
        );
        offer.setStatus(Enum.status.Pending); // Default status on creation
        if (offerService.save(offer) != null) {
            return ResponseEntity.ok("Offer created successfully.");
        }
        return ResponseEntity.badRequest().body("Failed to create offer.");
    }

    @PutMapping("accept/{id}")
    public ResponseEntity<String> acceptOffer(@PathVariable Long id) {
        if (offerService.updateOfferStatus(id, Enum.status.Accepted)) {
            return ResponseEntity.ok("Offer accepted.");
        }
        return ResponseEntity.badRequest().body("Failed to accept offer.");
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deleteOffer(@PathVariable Long id) {
        if (offerService.deleteOffer(id)) {
            return ResponseEntity.ok("Offer deleted successfully.");
        }
        return ResponseEntity.badRequest().body("Failed to delete offer.");
    }
}
