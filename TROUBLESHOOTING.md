# Troubleshooting Guide

## 500 Internal Error

If you're seeing a "500 Internal Error" when running the application, it's most likely due to missing or incorrect Supabase configuration.

### Solution:

1. **Check if `.env` file exists** in the root directory
2. **Verify your `.env` file contains valid Supabase credentials:**

```env
PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

3. **Make sure you've replaced the placeholder values** with your actual Supabase credentials:
   - Go to [supabase.com](https://supabase.com)
   - Create a project (if you haven't already)
   - Go to **Project Settings** → **API**
   - Copy the **Project URL** and **anon public** key
   - Paste them into your `.env` file

4. **Restart the development server** after updating `.env`:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

### Common Issues:

#### Issue: "Missing Supabase configuration" error
**Solution:** Your `.env` file either doesn't exist or has placeholder values. Update it with your actual Supabase credentials.

#### Issue: Still getting 500 error after setting credentials
**Possible causes:**
- Invalid Supabase URL or key
- Supabase project is paused
- Network connectivity issues

**Solution:**
- Double-check your credentials in Supabase dashboard
- Make sure your Supabase project is active (not paused)
- Verify the URL format: `https://xxxxx.supabase.co` (not `http://`)

#### Issue: Environment variables not loading
**Solution:**
- Make sure `.env` file is in the root directory (same level as `package.json`)
- Restart the dev server after changing `.env`
- Don't use quotes around values in `.env` file
- No spaces around the `=` sign

### Quick Check:

Run this command to verify your `.env` file exists and has content:
```bash
# Windows PowerShell
Get-Content .env

# Mac/Linux
cat .env
```

You should see:
```
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

If you see placeholder values like `your_supabase_project_url`, you need to replace them with your actual credentials.

