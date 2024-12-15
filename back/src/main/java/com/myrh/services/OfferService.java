package com.myrh.services;

import com.myrh.models.Offer;
import com.myrh.repositories.OfferRepository;
import com.myrh.utils.Enum;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OfferService {
    private final OfferRepository offerRepository;

    public OfferService(OfferRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    public List<Offer> listAll() {
        return offerRepository.findAll();
    }

    public Offer getOfferById(Long id) {
        return offerRepository.findById(id).orElse(null);
    }

    public List<Offer> listAllAcceptedOffers() {
        return offerRepository.findAll()
                .stream()
                .filter(offer -> offer.getStatus() == Enum.status.Accepted)
                .collect(Collectors.toList());
    }

    public Offer getAcceptedOfferById(Long id) {
        return offerRepository.findById(id)
                .filter(offer -> offer.getStatus() == Enum.status.Accepted)
                .orElse(null);
    }

    public Offer save(Offer offer) {
        return offerRepository.save(offer);
    }

    public boolean updateOfferStatus(Long id, Enum.status status) {
        Offer offer = getOfferById(id);
        if (offer != null) {
            offer.setStatus(status); // Set the enum directly
            offerRepository.save(offer); // Save the updated entity
            return true;
        }
        return false;
    }

    public boolean deleteOffer(Long id) {
        if (getOfferById(id) != null) {
            offerRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Offer> getOffersByCompany(Long companyId) {
        return offerRepository.findAllByCompanyId(companyId);
    }
}
