# Quick Start Guide

## Step 1: Install Dependencies

If you haven't already, install all required packages:

```bash
npm install
```

## Step 2: Set Up Supabase

1. **Create a Supabase Account** (if you don't have one):
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up for a free account

2. **Create a New Project**:
   - Click "New Project"
   - Choose an organization
   - Enter project name and database password
   - Select a region close to you
   - Click "Create new project"

3. **Set Up the Database**:
   - Once your project is ready, go to the **SQL Editor** in the left sidebar
   - Click "New query"
   - Copy the entire contents of `supabase/migrations/001_create_tasks_table.sql`
   - Paste it into the SQL Editor
   - Click "Run" (or press Ctrl+Enter)
   - You should see "Success. No rows returned"

4. **Get Your API Keys**:
   - Go to **Project Settings** (gear icon in left sidebar)
   - Click on **API** in the settings menu
   - You'll need:
     - **Project URL** (under "Project URL")
     - **anon public** key (under "Project API keys")

## Step 3: Configure Environment Variables

1. **Create `.env` file** in the root directory:

```bash
# On Windows PowerShell:
Copy-Item .env.example .env

# On Mac/Linux:
cp .env.example .env
```

2. **Edit `.env` file** and add your Supabase credentials:

```env
PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace:
- `https://your-project-id.supabase.co` with your **Project URL** from Supabase
- `your-anon-key-here` with your **anon public** key from Supabase

## Step 4: Run the Development Server

```bash
npm run dev
```

The application will start and you should see output like:

```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 5: Open in Browser

Open your browser and navigate to:
```
http://localhost:5173
```

You'll be redirected to the login page. Since you don't have an account yet:

1. Click "Don't have an account? Sign up"
2. Create a new account with your email and password
3. You'll be automatically logged in and redirected to the tasks page
4. Start creating tasks!

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically use the next available port (5174, 5175, etc.). Check the terminal output for the correct URL.

### Environment Variables Not Working
- Make sure your `.env` file is in the root directory (same level as `package.json`)
- Restart the dev server after changing `.env` file
- Make sure there are no spaces around the `=` sign in `.env` file
- Don't use quotes around the values in `.env` file

### Database Errors
- Make sure you ran the SQL migration script in Supabase
- Check that your Supabase project is active (not paused)
- Verify your API keys are correct in `.env` file

### Build for Production

To build the application for production:

```bash
npm run build
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript type checking

