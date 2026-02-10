-- Create directors table
CREATE TABLE IF NOT EXISTS directors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_hindi TEXT,
    title TEXT NOT NULL,
    title_hindi TEXT,
    category TEXT NOT NULL CHECK (category IN ('national', 'international')),
    photo_url TEXT,
    bio TEXT,
    bio_hindi TEXT,
    email TEXT,
    phone TEXT,
    linkedin_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE directors ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Everyone can view active directors
CREATE POLICY "Anyone can view active directors"
    ON directors
    FOR SELECT
    USING (is_active = true);

-- Admins can view all directors
CREATE POLICY "Admins can view all directors"
    ON directors
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Admins can insert directors
CREATE POLICY "Admins can insert directors"
    ON directors
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Admins can update directors
CREATE POLICY "Admins can update directors"
    ON directors
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Admins can delete directors
CREATE POLICY "Admins can delete directors"
    ON directors
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Indexes for performance
CREATE INDEX idx_directors_category ON directors(category);
CREATE INDEX idx_directors_order ON directors(display_order);
CREATE INDEX idx_directors_active ON directors(is_active);
CREATE INDEX idx_directors_created_at ON directors(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_directors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_directors_timestamp
    BEFORE UPDATE ON directors
    FOR EACH ROW
    EXECUTE FUNCTION update_directors_updated_at();
