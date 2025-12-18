/*
  # Create User Interactions and Contributions Tables

  1. New Tables
    - `comments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `content` (text, required)
      - `target_type` (text) - 'event', 'invention', 'person'
      - `target_id` (uuid, required)
      - `parent_comment_id` (uuid) - for nested comments
      - `upvotes` (integer, default 0)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `votes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `target_type` (text) - 'event', 'invention', 'comment'
      - `target_id` (uuid, required)
      - `vote_type` (text) - 'upvote' or 'downvote'
      - `created_at` (timestamptz, default now())
      - Unique constraint on (user_id, target_type, target_id)
    
    - `bookmarks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `target_type` (text) - 'event', 'invention', 'person'
      - `target_id` (uuid, required)
      - `notes` (text)
      - `created_at` (timestamptz, default now())
      - Unique constraint on (user_id, target_type, target_id)
    
    - `user_achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `achievement_type` (text) - e.g., 'first_contribution', 'verified_contributor', 'explorer_100'
      - `achievement_name` (text)
      - `achievement_description` (text)
      - `points_awarded` (integer, default 0)
      - `unlocked_at` (timestamptz, default now())
  
  2. Indexes
    - Index on target references for quick lookups
    - Index on user_id for user activity queries
  
  3. Security
    - Enable RLS on all tables
    - Users can only create/update/delete their own content
    - All users can read public content
*/

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  parent_comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_target_type CHECK (target_type IN ('event', 'invention', 'person'))
);

CREATE INDEX IF NOT EXISTS idx_comments_target ON comments(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_comment_id);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  vote_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_vote_target_type CHECK (target_type IN ('event', 'invention', 'comment')),
  CONSTRAINT valid_vote_type CHECK (vote_type IN ('upvote', 'downvote')),
  CONSTRAINT unique_user_vote UNIQUE (user_id, target_type, target_id)
);

CREATE INDEX IF NOT EXISTS idx_votes_target ON votes(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_votes_user ON votes(user_id);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_bookmark_target_type CHECK (target_type IN ('event', 'invention', 'person')),
  CONSTRAINT unique_user_bookmark UNIQUE (user_id, target_type, target_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_target ON bookmarks(target_type, target_id);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  achievement_name text NOT NULL,
  achievement_description text,
  points_awarded integer DEFAULT 0,
  unlocked_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Votes policies
CREATE POLICY "Votes are viewable by everyone"
  ON votes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert votes"
  ON votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON votes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON votes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Bookmarks policies
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert bookmarks"
  ON bookmarks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks"
  ON bookmarks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- User achievements policies
CREATE POLICY "Users can view their own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Triggers
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
