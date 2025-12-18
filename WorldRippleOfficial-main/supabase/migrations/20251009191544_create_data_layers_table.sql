/*
  # Create Data Layers and Related Tables

  1. New Tables
    - `data_layers`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `description` (text)
      - `category` (text) - 'disease', 'housing', 'environment', 'politics', 'economy', 'social'
      - `color` (text)
      - `is_active` (boolean, default true)
      - `data_source` (text)
      - `created_at` (timestamptz, default now())
    
    - `layer_data_points`
      - `id` (uuid, primary key)
      - `layer_id` (uuid, references data_layers)
      - `year` (integer, required)
      - `location_name` (text)
      - `location_lat` (numeric)
      - `location_lng` (numeric)
      - `country_code` (text)
      - `value` (numeric)
      - `intensity` (numeric) - 0-1 scale
      - `metadata` (jsonb) - additional data specific to the layer
      - `created_at` (timestamptz, default now())
  
  2. Indexes
    - Index on layer_id and year for efficient queries
    - Index on location for spatial queries
  
  3. Security
    - Enable RLS on both tables
    - Public read access for data layers
    - Restricted write access
*/

CREATE TABLE IF NOT EXISTS data_layers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  color text,
  is_active boolean DEFAULT true,
  data_source text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_category CHECK (category IN ('disease', 'housing', 'environment', 'politics', 'economy', 'social'))
);

CREATE TABLE IF NOT EXISTS layer_data_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_id uuid NOT NULL REFERENCES data_layers(id) ON DELETE CASCADE,
  year integer NOT NULL,
  location_name text,
  location_lat numeric,
  location_lng numeric,
  country_code text,
  value numeric,
  intensity numeric,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_intensity CHECK (intensity >= 0 AND intensity <= 1)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_data_layers_category ON data_layers(category);
CREATE INDEX IF NOT EXISTS idx_layer_data_points_layer ON layer_data_points(layer_id, year);
CREATE INDEX IF NOT EXISTS idx_layer_data_points_location ON layer_data_points(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_layer_data_points_country ON layer_data_points(country_code);

ALTER TABLE data_layers ENABLE ROW LEVEL SECURITY;
ALTER TABLE layer_data_points ENABLE ROW LEVEL SECURITY;

-- Data layers policies
CREATE POLICY "Data layers are viewable by everyone"
  ON data_layers
  FOR SELECT
  TO authenticated
  USING (true);

-- Layer data points policies
CREATE POLICY "Layer data points are viewable by everyone"
  ON layer_data_points
  FOR SELECT
  TO authenticated
  USING (true);
