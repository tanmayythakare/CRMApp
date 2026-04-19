package com.crm.contact;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ContactRepository extends JpaRepository<Contact, UUID> {

    /**
     * Search contacts by name or email (case-insensitive) with pagination.
     */
    Page<Contact> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String name, String email, Pageable pageable);

    /**
     * Filter contacts by status with pagination.
     */
    Page<Contact> findByStatus(ContactStatus status, Pageable pageable);

    /**
     * Search contacts by name or email AND filter by status.
     */
    @Query("SELECT c FROM Contact c WHERE c.status = :status AND " +
           "(LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Contact> findByStatusAndSearch(
            @Param("status") ContactStatus status,
            @Param("search") String search,
            Pageable pageable);

    /**
     * Find contacts by status (non-paginated).
     */
    List<Contact> findByStatus(ContactStatus status);

    /**
     * Count contacts by status.
     */
    long countByStatus(ContactStatus status);
}
