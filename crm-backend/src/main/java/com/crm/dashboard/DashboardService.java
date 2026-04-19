package com.crm.dashboard;

import com.crm.contact.ContactRepository;
import com.crm.contact.ContactStatus;
import com.crm.dashboard.dto.DailyInteractionCountDTO;
import com.crm.dashboard.dto.DashboardSummaryDTO;
import com.crm.dashboard.dto.TopContactDTO;
import com.crm.interaction.InteractionMapper;
import com.crm.interaction.InteractionRepository;
import com.crm.interaction.dto.InteractionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final ContactRepository contactRepository;
    private final InteractionRepository interactionRepository;
    private final InteractionMapper interactionMapper;

    /**
     * Get dashboard summary statistics.
     */
    public DashboardSummaryDTO getSummary() {
        long totalContacts = contactRepository.count();
        long activeContacts = contactRepository.countByStatus(ContactStatus.ACTIVE);
        Instant oneWeekAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        long interactionsThisWeek = interactionRepository.countByInteractionDateAfter(oneWeekAgo);
        long followUpsDue = interactionRepository.countFollowUpsDue(oneWeekAgo);

        return new DashboardSummaryDTO(totalContacts, activeContacts, interactionsThisWeek, followUpsDue);
    }

    /**
     * Get daily interaction counts for the chart.
     */
    public List<DailyInteractionCountDTO> getInteractionChart(int days) {
        Instant since = Instant.now().minus(days, ChronoUnit.DAYS);
        List<Object[]> results = interactionRepository.getDailyInteractionCounts(since);

        return results.stream()
                .map(row -> new DailyInteractionCountDTO(
                        ((Date) row[0]).toLocalDate(),
                        ((Number) row[1]).longValue()))
                .collect(Collectors.toList());
    }

    /**
     * Get recent interactions with contact info.
     */
    public List<InteractionDTO> getRecentInteractions(int limit) {
        return interactionRepository.findRecentWithContact(limit)
                .stream()
                .map(interactionMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get top contacts by interaction count.
     */
    public List<TopContactDTO> getTopContacts(int limit) {
        List<Object[]> results = interactionRepository.getTopContacts(limit);

        return results.stream()
                .map(row -> new TopContactDTO(
                        UUID.fromString(row[0].toString()),
                        (String) row[1],
                        ((Number) row[2]).longValue(),
                        ((Timestamp) row[3]).toInstant()))
                .collect(Collectors.toList());
    }
}
