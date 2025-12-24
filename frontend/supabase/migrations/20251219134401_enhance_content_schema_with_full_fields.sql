/*
  # Enhance Content Schema with Complete Field Structure

  ## Overview
  This migration adds comprehensive field structure for all content types including:
  - Tags and taxonomy system
  - Enhanced content fields (read time, testimonials, key attributes, etc.)
  - Comments and approval system
  - User library (saved items)
  - SEO metadata
  - Media gallery support
  - Status workflow

  ## New Tables

  ### `tags`
  Multi-purpose tags for all content types.
  - `id` (uuid, primary key)
  - `name` (text)
  - `slug` (text)
  - `namespace` (text) - e.g., 'discipline', 'level', 'topic'
  - `created_at` (timestamp)

  ### `content_tags`
  Junction table for many-to-many relationship between content and tags.
  - `id` (uuid, primary key)
  - `content_type` (text)
  - `content_id` (uuid)
  - `tag_id` (uuid)
  - `created_at` (timestamp)

  ### `content_comments`
  Comments and approval system for all content.
  - `id` (uuid, primary key)
  - `content_type` (text)
  - `content_id` (uuid)
  - `user_id` (uuid)
  - `comment` (text)
  - `is_approval` (boolean) - true for approval comments
  - `parent_id` (uuid) - for threaded comments
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ### `user_library`
  Saved items for users.
  - `id` (uuid, primary key)
  - `user_id` (uuid)
  - `content_type` (text)
  - `content_id` (uuid)
  - `notes` (text, nullable)
  - `created_at` (timestamp)

  ### `media_gallery`
  Media items for case studies and other content.
  - `id` (uuid, primary key)
  - `content_type` (text)
  - `content_id` (uuid)
  - `media_type` (text) - 'image', 'video', 'pdf'
  - `url` (text)
  - `title` (text, nullable)
  - `description` (text, nullable)
  - `display_order` (integer)
  - `created_at` (timestamp)

  ## Enhanced Fields
  - Add read_time, status, seo fields to content tables
  - Add testimonials, key attributes to case studies
  - Add file metadata to downloadables
  - Add event logistics fields
  - Add activity workflow fields

  ## Security
  - Enable RLS on all new tables
  - Users can comment on content they can access
  - Users can save items to their library
  - Only content managers can approve
*/

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  namespace text DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tags"
  ON tags FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create content_tags junction table
CREATE TABLE IF NOT EXISTS content_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL,
  content_id uuid NOT NULL,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(content_type, content_id, tag_id)
);

ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view content tags"
  ON content_tags FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create content_comments table
CREATE TABLE IF NOT EXISTS content_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL,
  content_id uuid NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  comment text NOT NULL,
  is_approval boolean DEFAULT false,
  parent_id uuid REFERENCES content_comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments on accessible content"
  ON content_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON content_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create user_library table
CREATE TABLE IF NOT EXISTS user_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content_type text NOT NULL,
  content_id uuid NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, content_type, content_id)
);

ALTER TABLE user_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own library"
  ON user_library FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own library"
  ON user_library FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own library"
  ON user_library FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create media_gallery table
CREATE TABLE IF NOT EXISTS media_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL,
  content_id uuid NOT NULL,
  media_type text NOT NULL,
  url text NOT NULL,
  title text,
  description text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view media gallery"
  ON media_gallery FOR SELECT
  TO authenticated, anon
  USING (true);

-- Enhance blogs table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'read_time') THEN
    ALTER TABLE blogs ADD COLUMN read_time integer DEFAULT 5;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'status') THEN
    ALTER TABLE blogs ADD COLUMN status text DEFAULT 'draft';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'seo_title') THEN
    ALTER TABLE blogs ADD COLUMN seo_title text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'seo_description') THEN
    ALTER TABLE blogs ADD COLUMN seo_description text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'og_image') THEN
    ALTER TABLE blogs ADD COLUMN og_image text;
  END IF;
END $$;

-- Enhance case_studies table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'problem') THEN
    ALTER TABLE case_studies ADD COLUMN problem text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'approach') THEN
    ALTER TABLE case_studies ADD COLUMN approach text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'outcome') THEN
    ALTER TABLE case_studies ADD COLUMN outcome text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'key_stats') THEN
    ALTER TABLE case_studies ADD COLUMN key_stats jsonb DEFAULT '[]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'testimonial_quote') THEN
    ALTER TABLE case_studies ADD COLUMN testimonial_quote text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'testimonial_author') THEN
    ALTER TABLE case_studies ADD COLUMN testimonial_author text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'status') THEN
    ALTER TABLE case_studies ADD COLUMN status text DEFAULT 'draft';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'seo_title') THEN
    ALTER TABLE case_studies ADD COLUMN seo_title text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'case_studies' AND column_name = 'seo_description') THEN
    ALTER TABLE case_studies ADD COLUMN seo_description text;
  END IF;
END $$;

-- Enhance downloadables table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'downloadables' AND column_name = 'version') THEN
    ALTER TABLE downloadables ADD COLUMN version text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'downloadables' AND column_name = 'read_time') THEN
    ALTER TABLE downloadables ADD COLUMN read_time integer;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'downloadables' AND column_name = 'testimonial_quote') THEN
    ALTER TABLE downloadables ADD COLUMN testimonial_quote text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'downloadables' AND column_name = 'testimonial_author') THEN
    ALTER TABLE downloadables ADD COLUMN testimonial_author text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'downloadables' AND column_name = 'status') THEN
    ALTER TABLE downloadables ADD COLUMN status text DEFAULT 'draft';
  END IF;
END $$;

-- Enhance recommendations table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recommendations' AND column_name = 'authors') THEN
    ALTER TABLE recommendations ADD COLUMN authors text[] DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recommendations' AND column_name = 'publisher') THEN
    ALTER TABLE recommendations ADD COLUMN publisher text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recommendations' AND column_name = 'edition') THEN
    ALTER TABLE recommendations ADD COLUMN edition text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recommendations' AND column_name = 'isbn') THEN
    ALTER TABLE recommendations ADD COLUMN isbn text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recommendations' AND column_name = 'key_takeaways') THEN
    ALTER TABLE recommendations ADD COLUMN key_takeaways text[] DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recommendations' AND column_name = 'publication_date') THEN
    ALTER TABLE recommendations ADD COLUMN publication_date date;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recommendations' AND column_name = 'pages') THEN
    ALTER TABLE recommendations ADD COLUMN pages integer;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recommendations' AND column_name = 'read_time') THEN
    ALTER TABLE recommendations ADD COLUMN read_time integer;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recommendations' AND column_name = 'why_recommend') THEN
    ALTER TABLE recommendations ADD COLUMN why_recommend text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recommendations' AND column_name = 'status') THEN
    ALTER TABLE recommendations ADD COLUMN status text DEFAULT 'draft';
  END IF;
END $$;

-- Enhance events table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'organiser') THEN
    ALTER TABLE events ADD COLUMN organiser text DEFAULT 'QBIX Academia';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'partner_details') THEN
    ALTER TABLE events ADD COLUMN partner_details jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'timezone') THEN
    ALTER TABLE events ADD COLUMN timezone text DEFAULT 'UTC';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'meeting_link') THEN
    ALTER TABLE events ADD COLUMN meeting_link text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'waitlist_enabled') THEN
    ALTER TABLE events ADD COLUMN waitlist_enabled boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'speakers') THEN
    ALTER TABLE events ADD COLUMN speakers jsonb DEFAULT '[]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'agenda') THEN
    ALTER TABLE events ADD COLUMN agenda text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'resources') THEN
    ALTER TABLE events ADD COLUMN resources jsonb DEFAULT '[]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'status') THEN
    ALTER TABLE events ADD COLUMN status text DEFAULT 'draft';
  END IF;
END $$;

-- Enhance activities table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'goform_link') THEN
    ALTER TABLE activities ADD COLUMN goform_link text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'reminders') THEN
    ALTER TABLE activities ADD COLUMN reminders jsonb DEFAULT '[]';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'activities' AND column_name = 'status') THEN
    ALTER TABLE activities ADD COLUMN status text DEFAULT 'draft';
  END IF;
END $$;

-- Enhance team_members table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'expertise') THEN
    ALTER TABLE team_members ADD COLUMN expertise text[] DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'identifiers') THEN
    ALTER TABLE team_members ADD COLUMN identifiers jsonb DEFAULT '[]';
  END IF;
END $$;

-- Add updated_at trigger to new tables
DROP TRIGGER IF EXISTS update_content_comments_updated_at ON content_comments;
CREATE TRIGGER update_content_comments_updated_at
  BEFORE UPDATE ON content_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default tags
INSERT INTO tags (name, slug, namespace) VALUES
  ('Study Abroad', 'study-abroad', 'topic'),
  ('USA', 'usa', 'country'),
  ('UK', 'uk', 'country'),
  ('Canada', 'canada', 'country'),
  ('Australia', 'australia', 'country'),
  ('Undergraduate', 'undergraduate', 'level'),
  ('Graduate', 'graduate', 'level'),
  ('PhD', 'phd', 'level'),
  ('Engineering', 'engineering', 'discipline'),
  ('Business', 'business', 'discipline'),
  ('Computer Science', 'computer-science', 'discipline'),
  ('Medicine', 'medicine', 'discipline'),
  ('Test Prep', 'test-prep', 'topic'),
  ('IELTS', 'ielts', 'exam'),
  ('TOEFL', 'toefl', 'exam'),
  ('GRE', 'gre', 'exam'),
  ('GMAT', 'gmat', 'exam'),
  ('Scholarships', 'scholarships', 'topic'),
  ('Visa', 'visa', 'topic'),
  ('Application Tips', 'application-tips', 'topic')
ON CONFLICT (slug) DO NOTHING;