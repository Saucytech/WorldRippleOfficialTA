/*
  # Fix Security and Performance Issues

  ## Overview
  This migration addresses critical security and performance issues identified in the database:
  
  ## Changes Made
  
  ### 1. Add Missing Foreign Key Indexes
  - Add index on `historical_events.created_by` for improved query performance on foreign key joins
  - Add index on `inventions.created_by` for improved query performance on foreign key joins
  
  ### 2. Optimize RLS Policies (Auth Function Caching)
  All RLS policies have been updated to use `(select auth.uid())` instead of `auth.uid()` directly.
  This prevents the auth function from being re-evaluated for each row, significantly improving
  query performance at scale.
  
  **Tables Updated:**
  - `profiles` - 2 policies optimized
  - `historical_events` - 4 policies optimized
  - `inventions` - 4 policies optimized
  - `invention_timeline_events` - 4 policies optimized
  - `comments` - 3 policies optimized
  - `votes` - 3 policies optimized
  - `bookmarks` - 4 policies optimized
  - `user_achievements` - 2 policies optimized
  
  ### 3. Fix Function Search Path Mutability
  Updated `update_updated_at_column()` function to use a stable search_path, preventing
  potential security issues with search path manipulation.
  
  ## Important Notes
  - All existing policies are dropped and recreated with optimized versions
  - Foreign key indexes improve join performance without changing functionality
  - No data is modified, only schema and policies are updated
  - Unused indexes are kept as they may be utilized as the application grows
*/

-- =====================================================
-- 1. ADD MISSING FOREIGN KEY INDEXES
-- =====================================================

-- Add index for historical_events.created_by foreign key
CREATE INDEX IF NOT EXISTS idx_historical_events_created_by 
  ON historical_events(created_by);

-- Add index for inventions.created_by foreign key
CREATE INDEX IF NOT EXISTS idx_inventions_created_by 
  ON inventions(created_by);

-- =====================================================
-- 2. FIX FUNCTION SEARCH PATH MUTABILITY
-- =====================================================

-- Drop and recreate the function with stable search_path
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate all triggers that use this function
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_historical_events_updated_at
  BEFORE UPDATE ON historical_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventions_updated_at
  BEFORE UPDATE ON inventions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. OPTIMIZE RLS POLICIES - PROFILES TABLE
-- =====================================================

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- =====================================================
-- 4. OPTIMIZE RLS POLICIES - HISTORICAL_EVENTS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Verified events are viewable by everyone" ON historical_events;
DROP POLICY IF EXISTS "Authenticated users can insert events" ON historical_events;
DROP POLICY IF EXISTS "Users can update their own events" ON historical_events;
DROP POLICY IF EXISTS "Users can delete their own events" ON historical_events;

CREATE POLICY "Verified events are viewable by everyone"
  ON historical_events
  FOR SELECT
  TO authenticated
  USING (verified = true OR created_by = (select auth.uid()));

CREATE POLICY "Authenticated users can insert events"
  ON historical_events
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = created_by);

CREATE POLICY "Users can update their own events"
  ON historical_events
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = created_by)
  WITH CHECK ((select auth.uid()) = created_by);

CREATE POLICY "Users can delete their own events"
  ON historical_events
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = created_by);

-- =====================================================
-- 5. OPTIMIZE RLS POLICIES - INVENTIONS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Verified inventions are viewable by everyone" ON inventions;
DROP POLICY IF EXISTS "Authenticated users can insert inventions" ON inventions;
DROP POLICY IF EXISTS "Users can update their own inventions" ON inventions;
DROP POLICY IF EXISTS "Users can delete their own inventions" ON inventions;

CREATE POLICY "Verified inventions are viewable by everyone"
  ON inventions
  FOR SELECT
  TO authenticated
  USING (verified = true OR created_by = (select auth.uid()));

CREATE POLICY "Authenticated users can insert inventions"
  ON inventions
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = created_by);

CREATE POLICY "Users can update their own inventions"
  ON inventions
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = created_by)
  WITH CHECK ((select auth.uid()) = created_by);

CREATE POLICY "Users can delete their own inventions"
  ON inventions
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = created_by);

-- =====================================================
-- 6. OPTIMIZE RLS POLICIES - INVENTION_TIMELINE_EVENTS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Timeline events viewable with parent invention" ON invention_timeline_events;
DROP POLICY IF EXISTS "Users can insert timeline events for their inventions" ON invention_timeline_events;
DROP POLICY IF EXISTS "Users can update timeline events for their inventions" ON invention_timeline_events;
DROP POLICY IF EXISTS "Users can delete timeline events for their inventions" ON invention_timeline_events;

CREATE POLICY "Timeline events viewable with parent invention"
  ON invention_timeline_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM inventions
      WHERE inventions.id = invention_timeline_events.invention_id
      AND (inventions.verified = true OR inventions.created_by = (select auth.uid()))
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
      AND inventions.created_by = (select auth.uid())
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
      AND inventions.created_by = (select auth.uid())
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
      AND inventions.created_by = (select auth.uid())
    )
  );

-- =====================================================
-- 7. OPTIMIZE RLS POLICIES - COMMENTS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Authenticated users can insert comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

CREATE POLICY "Authenticated users can insert comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- =====================================================
-- 8. OPTIMIZE RLS POLICIES - VOTES TABLE
-- =====================================================

DROP POLICY IF EXISTS "Authenticated users can insert votes" ON votes;
DROP POLICY IF EXISTS "Users can update their own votes" ON votes;
DROP POLICY IF EXISTS "Users can delete their own votes" ON votes;

CREATE POLICY "Authenticated users can insert votes"
  ON votes
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own votes"
  ON votes
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own votes"
  ON votes
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- =====================================================
-- 9. OPTIMIZE RLS POLICIES - BOOKMARKS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Authenticated users can insert bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can update their own bookmarks" ON bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON bookmarks;

CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Authenticated users can insert bookmarks"
  ON bookmarks
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own bookmarks"
  ON bookmarks
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- =====================================================
-- 10. OPTIMIZE RLS POLICIES - USER_ACHIEVEMENTS TABLE
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;
DROP POLICY IF EXISTS "System can insert achievements" ON user_achievements;

CREATE POLICY "Users can view their own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "System can insert achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);
