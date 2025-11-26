# Task Management Application

A modern task management application built with SvelteKit, Shadcn Svelte, and Supabase. This application allows users to authenticate, create tasks, and manage their task list with features like sorting, filtering, and search.

## Features

### Authentication
- ✅ User sign up with email and password
- ✅ User login with email and password
- ✅ "Remember me" functionality
- ✅ Form validation (email format, password strength)
- ✅ Error handling for existing users
- ✅ Protected routes with session persistence
- ✅ Logout functionality

### Task Management
- ✅ Create tasks with:
  - Title (required, max 100 characters)
  - Description (optional, max 500 characters)
  - Priority (Low, Medium, High)
  - Due Date (required)
  - Status (Pending, In Progress, Completed)
- ✅ Client-side validation
- ✅ Display validation errors
- ✅ Submit button disabled while submitting
- ✅ Success/error messages after submission
- ✅ Form clears after successful submission

### Task List Display
- ✅ Display all tasks created by logged-in user
- ✅ Task cards showing:
  - Title
  - Description (truncated if too long)
  - Priority (with color coding)
  - Due date (formatted)
  - Status badge
- ✅ Sort by: Due date, Priority, Created date
- ✅ Filter by: Status, Priority
- ✅ Search by title
- ✅ Empty state when no tasks exist
- ✅ Actions:
  - Edit task
  - Delete task (with confirmation)
  - Mark as complete/incomplete

### UI/UX
- ✅ Shadcn Svelte components throughout
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading states for async operations
- ✅ Consistent color scheme and spacing
- ✅ Modern, clean interface

### Technical Requirements
- ✅ SvelteKit form actions for submissions
- ✅ Proper load functions
- ✅ Error handling
- ✅ Supabase with RLS policies
- ✅ User-specific data access
- ✅ TypeScript types
- ✅ Clean, readable code with comments

## Tech Stack

- **Framework**: SvelteKit
- **UI Components**: Shadcn Svelte (custom implementation)
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS
- **Validation**: Zod (available, can be integrated)
- **Date Formatting**: date-fns
- **TypeScript**: Full type safety

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Proxie
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Run the migration script from `supabase/migrations/001_create_tasks_table.sql`
   - This creates the `tasks` table with proper RLS policies
   - Sets up indexes for performance
   - Creates triggers for automatic timestamp updates

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Fill in your Supabase credentials:

```env
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings:
- Go to Project Settings → API
- Copy the "Project URL" for `PUBLIC_SUPABASE_URL`
- Copy the "anon public" key for `PUBLIC_SUPABASE_ANON_KEY`

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
npm run preview
```

## Database Schema

### Tasks Table

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    priority VARCHAR(20) CHECK (priority IN ('Low', 'Medium', 'High')),
    due_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed')),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);
```

### Row Level Security (RLS)

All RLS policies ensure users can only:
- View their own tasks
- Create tasks for themselves
- Update their own tasks
- Delete their own tasks

## Project Structure

```
Proxie/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   └── ui/          # Shadcn Svelte components
│   │   ├── supabase/        # Supabase client utilities
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils.ts         # Utility functions
│   ├── routes/
│   │   ├── login/           # Login page
│   │   ├── signup/          # Sign up page
│   │   ├── tasks/           # Tasks management page
│   │   └── +layout.svelte   # Root layout
│   ├── app.css              # Global styles
│   ├── app.d.ts             # Type definitions
│   └── hooks.server.ts      # Server hooks for Supabase
├── supabase/
│   └── migrations/          # Database migrations
├── static/                  # Static assets
└── README.md
```

## Usage

1. **Sign Up**: Create a new account with your email and password
2. **Login**: Sign in with your credentials
3. **Create Tasks**: Fill out the task form on the left side
4. **Manage Tasks**: 
   - Use search to find specific tasks
   - Filter by status or priority
   - Sort by due date, priority, or creation date
   - Edit tasks by clicking the "Edit" button
   - Delete tasks with confirmation
   - Toggle task completion status

## Design Decisions

1. **Form Actions**: Used SvelteKit's form actions for all form submissions as required
2. **Component Library**: Implemented Shadcn Svelte components manually for full control
3. **State Management**: Used Svelte 5 runes ($state, $derived) for reactive state
4. **Validation**: Client-side validation with server-side validation as backup
5. **RLS Policies**: Implemented comprehensive Row Level Security for data isolation
6. **Responsive Design**: Mobile-first approach with Tailwind CSS

## Known Issues & Limitations

- Password reset link is a placeholder (not fully implemented)
- No real-time updates (can be added as a bonus feature)
- No dark mode toggle (can be added as a bonus feature)
- No task categories/tags (can be added as a bonus feature)

## Future Enhancements (Bonus Features)

- [ ] Real-time updates when tasks are added/updated
- [ ] Dark mode toggle
- [ ] Task categories/tags
- [ ] Task due date reminders
- [ ] Collaborative tasks (share with other users)
- [ ] Task attachments
- [ ] Task comments
- [ ] Export tasks to CSV/PDF

## Contributing

This is an assignment project. For questions or issues, please contact the project maintainer.

## License

This project is created for educational purposes.

## Screenshots

_Add screenshots of your application here_

## Demo Credentials

_If deploying, provide demo credentials here_
