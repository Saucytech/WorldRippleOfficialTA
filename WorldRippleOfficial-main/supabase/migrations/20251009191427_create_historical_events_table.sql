/*
  # Create Historical Events Table

  1. New Tables
    - `historical_events`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, required)
      - `event_date` (date, required)
      - `year` (integer, required)
      - `location_name` (text)
      - `location_lat` (numeric)
      - `location_lng` (numeric)
      - `category` (text) - e.g., 'political', 'scientific', 'cultural', 'disaster', 'war'
      - `impact_level` (text) - 'local', 'regional', 'national', 'global'
      - `tags` (text[])
      - `image_url` (text)
      - `source_urls` (jsonb, default '[]')
      - `created_by` (uuid, references profiles)
      - `verified` (boolean, default false)
      - `upvotes` (integer, default 0)
      - `downvotes` (integer, default 0)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
  
  2. Indexes
    - Index on year for timeline queries
    - Index on category for filtering
    - Index on location coordinates for spatial queries
  
  3. Security
    - Enable RLS on `historical_events` table
    - Add policy for everyone to read verified events
    - Add policy for authenticated users to read all events
    - Add policy for authenticated users to insert events
    - Add policy for users to update their own events
*/

CREATE TABLE IF NOT EXISTS historical_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  event_date date NOT NULL,
  year integer NOT NULL,
  location_name text,
  location_lat numeric,
  location_lng numeric,
  category text,
  impact_level text DEFAULT 'local',
  tags text[] DEFAULT ARRAY[]::text[],
  image_url text,
  source_urls jsonb DEFAULT '[]'::jsonb,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  verified boolean DEFAULT false,
  upvotes integer DEFAULT 0,
  downvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_impact_level CHECK (impact_level IN ('local', 'regional', 'national', 'global'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_historical_events_year ON historical_events(year);
CREATE INDEX IF NOT EXISTS idx_historical_events_category ON historical_events(category);
CREATE INDEX IF NOT EXISTS idx_historical_events_location ON historical_events(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_historical_events_verified ON historical_events(verified);

ALTER TABLE historical_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Verified events are viewable by everyone"
  ON historical_events
  FOR SELECT
  TO authenticated
  USING (verified = true OR created_by = auth.uid());

CREATE POLICY "Authenticated users can insert events"
  ON historical_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events"
  ON historical_events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own events"
  ON historical_events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE TRIGGER update_historical_events_updated_at
  BEFORE UPDATE ON historical_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
