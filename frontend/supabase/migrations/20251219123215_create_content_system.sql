/*
  # Create Content Management System

  ## Overview
  This migration creates tables for managing all content types in the QBIX Academia platform:
  blogs, case studies, downloadables, recommendations, and events.

  ## New Tables

  ### `content_categories`
  Categories for organizing content across all content types.
  - `id` (uuid, primary key)
  - `name` (text) - Category name
  - `slug` (text) - URL-friendly slug
  - `description` (text)
  - `created_at` (timestamp)

  ### `blogs`
  Blog posts with rich content.
  - `id` (uuid, primary key)
  - `title` (text)
  - `slug` (text) - URL-friendly slug
  - `excerpt` (text) - Short summary
  - `content` (text) - Full content (markdown/HTML)
  - `featured_image` (text) - Image URL
  - `author_id` (uuid) - References profiles
  - `category_id` (uuid) - References content_categories
  - `is_published` (boolean)
  - `published_at` (timestamp)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ### `case_studies`
  Case studies showcasing success stories.
  - `id` (uuid, primary key)
  - `title` (text)
  - `slug` (text)
  - `excerpt` (text)
  - `content` (text)
  - `featured_image` (text)
  - `author_id` (uuid)
  - `category_id` (uuid)
  - `student_name` (text, nullable)
  - `destination_country` (text, nullable)
  - `university` (text, nullable)
  - `is_published` (boolean)
  - `published_at` (timestamp)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ### `downloadables`
  Downloadable resources (PDFs, guides, etc.).
  - `id` (uuid, primary key)
  - `title` (text)
  - `slug` (text)
  - `description` (text)
  - `file_url` (text) - URL to file
  - `file_type` (text) - e.g., 'pdf', 'docx'
  - `file_size` (integer) - Size in bytes
  - `thumbnail_url` (text, nullable)
  - `author_id` (uuid)
  - `category_id` (uuid)
  - `download_count` (integer)
  - `is_published` (boolean)
  - `published_at` (timestamp)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ### `recommendations`
  Recommended resources, tools, services, or courses.
  - `id` (uuid, primary key)
  - `title` (text)
  - `slug` (text)
  - `description` (text)
  - `content` (text)
  - `link_url` (text) - External link
  - `thumbnail_url` (text, nullable)
  - `recommendation_type` (text) - e.g., 'tool', 'service', 'course'
  - `author_id` (uuid)
  - `category_id` (uuid)
  - `is_published` (boolean)
  - `published_at` (timestamp)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ### `events`
  Events, webinars, workshops.
  - `id` (uuid, primary key)
  - `title` (text)
  - `slug` (text)
  - `description` (text)
  - `content` (text)
  - `featured_image` (text)
  - `event_type` (text) - e.g., 'webinar', 'workshop', 'seminar'
  - `start_date` (timestamp)
  - `end_date` (timestamp)
  - `location` (text) - Physical or online URL
  - `is_online` (boolean)
  - `max_attendees` (integer, nullable)
  - `registration_deadline` (timestamp, nullable)
  - `author_id` (uuid)
  - `category_id` (uuid)
  - `is_published` (boolean)
  - `published_at` (timestamp)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ### `event_registrations`
  Track user registrations for events.
  - `id` (uuid, primary key)
  - `event_id` (uuid)
  - `user_id` (uuid)
  - `status` (text) - 'registered', 'attended', 'cancelled'
  - `notes` (text, nullable)
  - `created_at` (timestamp)

  ## Security
  - Enable RLS on all tables
  - Public/anonymous can read published content
  - Authenticated users can read all published content
  - Only content managers and admins can create/edit content
  - Users can view their own event registrations
*/

-- Create content_categories table
CREATE TABLE IF NOT EXISTS content_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE content_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON content_categories FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text DEFAULT '',
  content text DEFAULT '',
  featured_image text,
  author_id uuid REFERENCES profiles(id),
  category_id uuid REFERENCES content_categories(id),
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blogs"
  ON blogs FOR SELECT
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Authenticated users can view all blogs"
  ON blogs FOR SELECT
  TO authenticated
  USING (true);

-- Create case_studies table
CREATE TABLE IF NOT EXISTS case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text DEFAULT '',
  content text DEFAULT '',
  featured_image text,
  author_id uuid REFERENCES profiles(id),
  category_id uuid REFERENCES content_categories(id),
  student_name text,
  destination_country text,
  university text,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published case studies"
  ON case_studies FOR SELECT
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Authenticated users can view all case studies"
  ON case_studies FOR SELECT
  TO authenticated
  USING (true);

-- Create downloadables table
CREATE TABLE IF NOT EXISTS downloadables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  file_url text NOT NULL,
  file_type text DEFAULT '',
  file_size integer DEFAULT 0,
  thumbnail_url text,
  author_id uuid REFERENCES profiles(id),
  category_id uuid REFERENCES content_categories(id),
  download_count integer DEFAULT 0,
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE downloadables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published downloadables"
  ON downloadables FOR SELECT
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Authenticated users can view all downloadables"
  ON downloadables FOR SELECT
  TO authenticated
  USING (true);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  content text DEFAULT '',
  link_url text,
  thumbnail_url text,
  recommendation_type text DEFAULT 'general',
  author_id uuid REFERENCES profiles(id),
  category_id uuid REFERENCES content_categories(id),
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published recommendations"
  ON recommendations FOR SELECT
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Authenticated users can view all recommendations"
  ON recommendations FOR SELECT
  TO authenticated
  USING (true);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  content text DEFAULT '',
  featured_image text,
  event_type text DEFAULT 'general',
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  location text DEFAULT '',
  is_online boolean DEFAULT false,
  max_attendees integer,
  registration_deadline timestamptz,
  author_id uuid REFERENCES profiles(id),
  category_id uuid REFERENCES content_categories(id),
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published events"
  ON events FOR SELECT
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Authenticated users can view all events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'registered',
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own registrations"
  ON event_registrations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own registrations"
  ON event_registrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registrations"
  ON event_registrations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_blogs_updated_at ON blogs;
CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_case_studies_updated_at ON case_studies;
CREATE TRIGGER update_case_studies_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_downloadables_updated_at ON downloadables;
CREATE TRIGGER update_downloadables_updated_at
  BEFORE UPDATE ON downloadables
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_recommendations_updated_at ON recommendations;
CREATE TRIGGER update_recommendations_updated_at
  BEFORE UPDATE ON recommendations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO content_categories (name, slug, description) VALUES
  ('Study Abroad', 'study-abroad', 'Content related to studying overseas'),
  ('Application Tips', 'application-tips', 'Tips for university applications'),
  ('Student Life', 'student-life', 'Information about student life abroad'),
  ('Career Guidance', 'career-guidance', 'Career advice and guidance'),
  ('Test Preparation', 'test-preparation', 'Resources for test preparation'),
  ('General', 'general', 'General content')
ON CONFLICT (slug) DO NOTHING;