package com.crm.interaction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface InteractionRepository extends JpaRepository<Interaction, UUID> {

    /**
     * Find all interactions for a specific contact, ordered by date descending.
     */
    List<Interaction> findByContactIdOrderByInteractionDateDesc(UUID contactId);

    /**
     * Find interactions within a date range.
     */
    List<Interaction> findByInteractionDateAfterOrderByInteractionDateDesc(Instant after);

    /**
     * Find recent interactions with a limit.
     */
    @Query("SELECT i FROM Interaction i JOIN FETCH i.contact ORDER BY i.interactionDate DESC LIMIT :limit")
    List<Interaction> findRecentWithContact(@Param("limit") int limit);

    /**
     * Count interactions within a date range.
     */
    long countByInteractionDateAfter(Instant after);

    /**
     * Get daily interaction counts for the chart.
     */
    @Query(value = "SELECT DATE(interaction_date) as date, COUNT(*) as count " +
                   "FROM interactions " +
                   "WHERE interaction_date >= :since " +
                   "GROUP BY DATE(interaction_date) " +
                   "ORDER BY date ASC", nativeQuery = true)
    List<Object[]> getDailyInteractionCounts(@Param("since") Instant since);

    /**
     * Get top contacts by interaction count.
     */
    @Query(value = "SELECT i.contact_id, c.name, COUNT(*) as cnt, MAX(i.interaction_date) as last_date " +
                   "FROM interactions i JOIN contacts c ON c.id = i.contact_id " +
                   "GROUP BY i.contact_id, c.name " +
                   "ORDER BY cnt DESC " +
                   "LIMIT :limit", nativeQuery = true)
    List<Object[]> getTopContacts(@Param("limit") int limit);

    /**
     * Find interactions by type.
     */
    List<Interaction> findByTypeOrderByInteractionDateDesc(InteractionType type);

    /**
     * Count follow-ups due (contacts with status LEAD and last interaction > 7 days ago).
     */
    @Query(value = "SELECT COUNT(DISTINCT c.id) FROM contacts c " +
                   "LEFT JOIN interactions i ON i.contact_id = c.id " +
                   "WHERE c.status = 'LEAD' " +
                   "AND (i.id IS NULL OR c.id NOT IN (" +
                   "  SELECT i2.contact_id FROM interactions i2 " +
                   "  WHERE i2.interaction_date >= :since" +
                   "))", nativeQuery = true)
    long countFollowUpsDue(@Param("since") Instant since);
}
