package com.crm.interaction;

import com.crm.contact.Contact;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "interactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contact_id", nullable = false)
    private Contact contact;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private InteractionType type;

    @Column(nullable = false, length = 500)
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "interaction_date", nullable = false)
    private Instant interactionDate;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    private String outcome;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;
}
