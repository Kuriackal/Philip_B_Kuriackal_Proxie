# Database Setup Guide

## Error: "Could not find the table 'public.tasks' in the schema cache"

This error means the `tasks` table hasn't been created in your Supabase database yet. Follow these steps to fix it:

## Step-by-Step Instructions

### 1. Open Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project (or create a new one if you haven't)

### 2. Open SQL Editor

1. In the left sidebar, click on **"SQL Editor"** (it has a database icon)
2. Click the **"New query"** button (top right)

### 3. Copy the Migration Script

Open the file `supabase/migrations/001_create_tasks_table.sql` from your project and copy its entire contents.

### 4. Paste and Run the SQL

1. Paste the SQL script into the SQL Editor
2. Click the **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
3. You should see a success message: "Success. No rows returned"

### 5. Verify the Table Was Created

1. In the left sidebar, click on **"Table Editor"**
2. You should now see a `tasks` table in the list
3. Click on it to see the table structure

### 6. Refresh Your Application

Go back to your application and try creating a task again. The error should be gone!

## What the Migration Does

The SQL script will:
- ✅ Create the `tasks` table with all required columns
- ✅ Set up Row Level Security (RLS) policies so users can only see their own tasks
- ✅ Create indexes for better performance
- ✅ Set up automatic timestamp updates

## Quick Copy-Paste SQL

If you can't find the file, here's the SQL you need to run:

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

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- Create index on due_date for sorting
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Create index on priority for filtering
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own tasks
CREATE POLICY "Users can view their own tasks"
    ON tasks FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy: Users can insert their own tasks
CREATE POLICY "Users can insert their own tasks"
    ON tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own tasks
CREATE POLICY "Users can update their own tasks"
    ON tasks FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own tasks
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

## Troubleshooting

### If you get an error about the table already existing:
- The table might already be partially created
- Try running: `DROP TABLE IF EXISTS tasks CASCADE;` first, then run the full script again

### If you get permission errors:
- Make sure you're running the SQL as the database owner
- Check that your Supabase project is active (not paused)

### If tasks still don't appear:
- Make sure you're logged in to the application
- Check the browser console for any other errors
- Verify your `.env` file has the correct Supabase credentials

