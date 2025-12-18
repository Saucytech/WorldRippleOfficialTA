/*
  # Create Inventions Table

  1. New Tables
    - `inventions`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `inventor` (text, required)
      - `year` (integer, required)
      - `location_name` (text, required)
      - `location_lat` (numeric, required)
      - `location_lng` (numeric, required)
      - `country` (text, required)
      - `description` (text, required)
      - `category` (text) - e.g., 'Communication', 'Transportation', 'Medicine', 'Computing', 'Energy'
      - `impact` (text) - description of the invention's impact
      - `timeline` (jsonb) - array of {year, event} objects
      - `image_url` (text)
      - `tags` (text[])
      - `created_by` (uuid, references profiles)
      - `verified` (boolean, default false)
      - `upvotes` (integer, default 0)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `invention_timeline_events`
      - `id` (uuid, primary key)
      - `invention_id` (uuid, references inventions)
      - `year` (integer, required)
      - `event` (text, required)
      - `order_index` (integer, default 0)
      - `created_at` (timestamptz, default now())
  
  2. Indexes
    - Index on year for timeline queries
    - Index on category for filtering
    - Index on inventor name for search
  
  3. Security
    - Enable RLS on both tables
    - Add policies for reading verified inventions
    - Add policies for authenticated users to contribute
*/

CREATE TABLE IF NOT EXISTS inventions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  inventor text NOT NULL,
  year integer NOT NULL,
  location_name text NOT NULL,
  location_lat numeric NOT NULL,
  location_lng numeric NOT NULL,
  country text NOT NULL,
  description text NOT NULL,
  category text,
  impact text,
  image_url text,
  tags text[] DEFAULT ARRAY[]::text[],
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  verified boolean DEFAULT false,
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invention_timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invention_id uuid NOT NULL REFERENCES inventions(id) ON DELETE CASCADE,
  year integer NOT NULL,
  event text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_inventions_year ON inventions(year);
CREATE INDEX IF NOT EXISTS idx_inventions_category ON inventions(category);
CREATE INDEX IF NOT EXISTS idx_inventions_inventor ON inventions(inventor);
CREATE INDEX IF NOT EXISTS idx_inventions_verified ON inventions(verified);
CREATE INDEX IF NOT EXISTS idx_invention_timeline_invention_id ON invention_timeline_events(invention_id);

ALTER TABLE inventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invention_timeline_events ENABLE ROW LEVEL SECURITY;

-- Inventions policies
CREATE POLICY "Verified inventions are viewable by everyone"
  ON inventions
  FOR SELECT
  TO authenticated
  USING (verified = true OR created_by = auth.uid());

CREATE POLICY "Authenticated users can insert inventions"
  ON inventions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own inventions"
  ON inventions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own inventions"
  ON inventions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Timeline events policies
CREATE POLICY "Timeline events viewable with parent invention"
  ON invention_timeline_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inventions
      WHERE inventions.id = invention_timeline_events.invention_id
      AND (inventions.verified = true OR inventions.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can insert timeline events for their inventions"
  ON invention_timeline_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM inventions
      WHERE inventions.id = invention_timeline_events.invention_id
      AND inventions.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update timeline events for their inventions"
  ON invention_timeline_events
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inventions
      WHERE inventions.id = invention_timeline_events.invention_id
      AND inventions.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete timeline events for their inventions"
  ON invention_timeline_events
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inventions
      WHERE inventions.id = invention_timeline_events.invention_id
      AND inventions.created_by = auth.uid()
    )
  );

CREATE TRIGGER update_inventions_updated_at
  BEFORE UPDATE ON inventions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
