-- Migration: Add user_id to courses table
-- Run this migration ONLY ONCE to update your existing database

-- Step 1: Add user_id column (allowing NULL temporarily)
ALTER TABLE courses ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

-- Step 2: If you have existing courses, assign them to a user
-- IMPORTANT: Replace '1' with an actual user ID from your users table
-- Or delete this line if you want to delete all existing courses instead
UPDATE courses SET user_id = 1 WHERE user_id IS NULL;

-- Step 3: Make user_id NOT NULL
ALTER TABLE courses ALTER COLUMN user_id SET NOT NULL;

-- Step 4: Add index for better performance
CREATE INDEX IF NOT EXISTS idx_courses_user_id ON courses(user_id);

-- Migration complete!
