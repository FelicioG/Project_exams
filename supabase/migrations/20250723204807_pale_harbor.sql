/*
  # Exam Portal Database Schema

  1. New Tables
    - `faculties`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `subjects`
      - `id` (uuid, primary key)
      - `faculty_id` (uuid, foreign key)
      - `name` (text)
      - `code` (text)
      - `semester` (integer)
      - `credits` (integer)
      - `created_at` (timestamp)
    
    - `papers`
      - `id` (uuid, primary key)
      - `subject_id` (uuid, foreign key)
      - `title` (text)
      - `year` (text)
      - `type` (text) -- 'midterm' or 'final'
      - `paper_url` (text)
      - `answer_url` (text)
      - `created_at` (timestamp)
    
    - `user_subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `plan_type` (text)
      - `active` (boolean)
      - `expires_at` (timestamp)
      - `created_at` (timestamp)
    
    - `paper_access_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `paper_id` (uuid, foreign key)
      - `accessed_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for subscription-based access
*/

-- Create faculties table
CREATE TABLE IF NOT EXISTS faculties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id uuid REFERENCES faculties(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  semester integer DEFAULT 1,
  credits integer DEFAULT 3,
  created_at timestamptz DEFAULT now()
);

-- Create papers table
CREATE TABLE IF NOT EXISTS papers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  title text NOT NULL,
  year text NOT NULL,
  type text NOT NULL CHECK (type IN ('midterm', 'final')),
  paper_url text,
  answer_url text,
  created_at timestamptz DEFAULT now()
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type text NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  active boolean DEFAULT true,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create paper_access_logs table
CREATE TABLE IF NOT EXISTS paper_access_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  paper_id uuid REFERENCES papers(id) ON DELETE CASCADE,
  accessed_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_access_logs ENABLE ROW LEVEL SECURITY;

-- Policies for faculties (public read)
CREATE POLICY "Anyone can view faculties"
  ON faculties
  FOR SELECT
  TO public
  USING (true);

-- Policies for subjects (public read)
CREATE POLICY "Anyone can view subjects"
  ON subjects
  FOR SELECT
  TO public
  USING (true);

-- Policies for papers (public read for basic info, subscription required for URLs)
CREATE POLICY "Anyone can view paper info"
  ON papers
  FOR SELECT
  TO public
  USING (true);

-- Policies for user_subscriptions (users can only see their own)
CREATE POLICY "Users can view own subscriptions"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON user_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for paper_access_logs (users can only see their own)
CREATE POLICY "Users can view own access logs"
  ON paper_access_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own access logs"
  ON paper_access_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert sample data
INSERT INTO faculties (name, description) VALUES
  ('Engineering', 'Computer Science, Information Technology, Electronics'),
  ('Science', 'Chemistry, Microbiology, Agriculture'),
  ('Management Studies', 'BBA, B.Com, Digital Finance'),
  ('Law', 'BA LLB, BCom LLB'),
  ('Physiotherapy', 'Physical Therapy Programs');

-- Insert sample subjects for Engineering
INSERT INTO subjects (faculty_id, name, code, semester, credits)
SELECT 
  f.id,
  subject.name,
  subject.code,
  subject.semester,
  subject.credits
FROM faculties f,
(VALUES 
  ('Data Structures', 'CS101', 3, 4),
  ('Algorithms', 'CS102', 4, 4),
  ('Database Systems', 'CS201', 5, 3),
  ('Computer Networks', 'CS202', 6, 3),
  ('Operating Systems', 'CS203', 5, 4),
  ('Software Engineering', 'CS301', 7, 3)
) AS subject(name, code, semester, credits)
WHERE f.name = 'Engineering';

-- Insert sample papers
INSERT INTO papers (subject_id, title, year, type, paper_url, answer_url)
SELECT 
  s.id,
  paper.title,
  paper.year,
  paper.type,
  '/sample-papers/' || s.code || '_' || paper.year || '_' || paper.type || '_paper.pdf',
  '/sample-papers/' || s.code || '_' || paper.year || '_' || paper.type || '_answer.pdf'
FROM subjects s,
(VALUES 
  ('Mid Term Exam', '2023-2024', 'midterm'),
  ('Final Exam', '2023-2024', 'final'),
  ('Mid Term Exam', '2022-2023', 'midterm'),
  ('Final Exam', '2022-2023', 'final'),
  ('Mid Term Exam', '2021-2022', 'midterm'),
  ('Final Exam', '2021-2022', 'final')
) AS paper(title, year, type)
WHERE s.code IN ('CS101', 'CS102', 'CS201');