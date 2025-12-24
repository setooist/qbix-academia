export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role_id?: string;
  tier_id?: string;
  is_active: boolean;
  bio?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  role?: MemberRole;
  tier?: MemberTier;
}

export interface MemberRole {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface MemberTier {
  id: string;
  name: string;
  description: string;
  priority: number;
  created_at: string;
}

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  author_id?: string;
  category_id?: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  author?: Profile;
  category?: ContentCategory;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  author_id?: string;
  category_id?: string;
  student_name?: string;
  destination_country?: string;
  university?: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  author?: Profile;
  category?: ContentCategory;
}

export interface Downloadable {
  id: string;
  title: string;
  slug: string;
  description: string;
  file_url: string;
  file_type: string;
  file_size: number;
  thumbnail_url?: string;
  author_id?: string;
  category_id?: string;
  download_count: number;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  author?: Profile;
  category?: ContentCategory;
}

export interface Recommendation {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  link_url?: string;
  thumbnail_url?: string;
  recommendation_type: string;
  author_id?: string;
  category_id?: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  author?: Profile;
  category?: ContentCategory;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  featured_image?: string;
  event_type: string;
  start_date: string;
  end_date: string;
  location: string;
  is_online: boolean;
  max_attendees?: number;
  registration_deadline?: string;
  author_id?: string;
  category_id?: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  author?: Profile;
  category?: ContentCategory;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  status: string;
  notes?: string;
  created_at: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  instructions: string;
  due_date?: string;
  points: number;
  attachment_url?: string;
  created_by?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ActivityAssignment {
  id: string;
  activity_id: string;
  student_id: string;
  assigned_by?: string;
  due_date?: string;
  status: string;
  assigned_at: string;
  started_at?: string;
  submitted_at?: string;
  reviewed_at?: string;
  activity?: Activity;
}

export interface ActivitySubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  content: string;
  attachment_urls: string[];
  submitted_at: string;
  score?: number;
  feedback?: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

export interface TeamMember {
  id: string;
  user_id?: string;
  full_name: string;
  title: string;
  department: string;
  bio: string;
  avatar_url?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ContentType = 'blog' | 'case_study' | 'downloadable' | 'recommendation' | 'event';
export type AccessLevel = 'public' | 'registered' | 'tier' | 'role' | 'allowlist';
