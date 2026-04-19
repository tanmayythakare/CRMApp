CREATE TABLE interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('CALL', 'EMAIL', 'MEETING', 'NOTE')),
    subject VARCHAR(500) NOT NULL,
    description TEXT,
    interaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER,
    outcome VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_interactions_contact_id ON interactions(contact_id);
CREATE INDEX idx_interactions_date ON interactions(interaction_date DESC);
CREATE INDEX idx_interactions_type ON interactions(type);
CREATE INDEX idx_interactions_date_week ON interactions(interaction_date)
    WHERE interaction_date >= NOW() - INTERVAL '7 days';
