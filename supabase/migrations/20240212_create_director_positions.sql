-- Create org_positions table to manage reusable positions (formerly director_positions)
CREATE TABLE IF NOT EXISTS org_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    title_hindi TEXT,
    category TEXT NOT NULL CHECK (category IN ('national', 'international')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(title, category)
);

-- Enable RLS
ALTER TABLE org_positions ENABLE ROW LEVEL SECURITY;

-- Policies
-- Everyone can read
CREATE POLICY "Anyone can view org positions"
    ON org_positions
    FOR SELECT
    USING (true);

-- Admins can insert
CREATE POLICY "Admins can insert org positions"
    ON org_positions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Admins can update
CREATE POLICY "Admins can update org positions"
    ON org_positions
    FOR UPDATE
    USING (
         EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Admins can delete
CREATE POLICY "Admins can delete org positions"
    ON org_positions
    FOR DELETE
    USING (
         EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );
