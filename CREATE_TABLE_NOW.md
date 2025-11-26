# ⚠️ URGENT: Create Database Table

## Error: "Could not find the table 'public.tasks' in the schema cache"

**Error Code:** `PGRST205`

This error means the `tasks` table doesn't exist in your Supabase database. You **MUST** create it before the app will work.

## Quick Fix (5 minutes)

### Step 1: Open Supabase
1. Go to: https://supabase.com/dashboard/project/qikafhenqiecyqyscjxn
2. Sign in if needed

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar (database icon)
2. Click **"New query"** button (top right)

### Step 3: Copy This SQL

Copy the ENTIRE SQL script below:

```sql
-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (users can only see their own tasks)
CREATE POLICY "Users can view their own tasks"
    ON tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
    ON tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
    ON tasks FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
    ON tasks FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Step 4: Run the SQL
1. Paste the SQL into the SQL Editor
2. Click **"Run"** button (or press `Ctrl+Enter`)
3. You should see: **"Success. No rows returned"**

### Step 5: Verify
1. Click **"Table Editor"** in the left sidebar
2. You should see a `tasks` table in the list
3. Click on it to see the table structure

### Step 6: Test Your App
1. Go back to your application
2. Refresh the page
3. Try creating a task again
4. **The error should be gone!** ✅

## Alternative: Use the Migration File

If you prefer, you can also:
1. Open the file: `supabase/migrations/001_create_tasks_table.sql` in your project
2. Copy its entire contents
3. Paste into Supabase SQL Editor
4. Run it

## What This Does

- ✅ Creates the `tasks` table with all required columns
- ✅ Sets up Row Level Security (RLS) so users only see their own tasks
- ✅ Creates indexes for faster queries
- ✅ Sets up automatic timestamp updates

## Still Having Issues?

If you still see errors after creating the table:
1. Make sure you clicked "Run" and saw "Success"
2. Refresh your browser
3. Check the terminal for any new error messages
4. Verify you're logged in to the app

