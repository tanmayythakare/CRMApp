package com.crm.dashboard;

import com.crm.dashboard.dto.DailyInteractionCountDTO;
import com.crm.dashboard.dto.DashboardSummaryDTO;
import com.crm.dashboard.dto.TopContactDTO;
import com.crm.interaction.dto.InteractionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/interactions-chart")
    public ResponseEntity<List<DailyInteractionCountDTO>> getInteractionsChart(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(dashboardService.getInteractionChart(days));
    }

    @GetMapping("/recent-interactions")
    public ResponseEntity<List<InteractionDTO>> getRecentInteractions(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(dashboardService.getRecentInteractions(limit));
    }

    @GetMapping("/top-contacts")
    public ResponseEntity<List<TopContactDTO>> getTopContacts(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(dashboardService.getTopContacts(limit));
    }
}
