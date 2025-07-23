# Exam Portal - TechLions

A modern, secure exam portal with subscription-based access to academic papers and comprehensive content protection.

## Features

### 🔐 Authentication & Authorization
- Secure user authentication with Supabase
- Email/password sign-up and sign-in
- Protected routes and content

### 💳 Subscription System
- Monthly and yearly subscription plans
- Subscription-based access to premium content
- Payment integration ready (Stripe compatible)

### 📚 Content Management
- Organized by Faculty → Subject → Exam Papers
- Support for question papers and answer keys
- Academic year-based organization

### 🛡️ Content Protection
- **Screenshot Prevention**: Disabled print screen and screenshot detection
- **Screen Recording Protection**: Content blur on window focus loss
- **Right-click Disabled**: Context menu blocked
- **Developer Tools Blocked**: F12, Ctrl+Shift+I, etc. disabled
- **Text Selection Disabled**: Prevents copying of content
- **Drag & Drop Disabled**: Images and content cannot be dragged

### 📱 Modern UI/UX
- Responsive design for all devices
- Smooth animations and transitions
- Glass morphism design elements
- Intuitive navigation with breadcrumbs

## Setup Instructions

### 1. Supabase Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Update the `.env` file with your credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

### 2. Database Migration
1. In your Supabase dashboard, go to the SQL Editor
2. Run the migration script from `supabase/migrations/create_exam_portal_schema.sql`
3. This will create all necessary tables and sample data

### 3. File Storage Setup
1. In Supabase, go to Storage
2. Create a bucket named `exam-papers`
3. Set appropriate policies for authenticated users
4. Upload your PDF files to this bucket

### 4. Run the Application
```bash
npm install
npm run dev
```

## Database Schema

### Tables
- **faculties**: Store faculty information
- **subjects**: Store subjects linked to faculties
- **papers**: Store exam papers with URLs to PDF files
- **user_subscriptions**: Track user subscription status
- **paper_access_logs**: Log when users access papers

### Security
- Row Level Security (RLS) enabled on all tables
- Policies ensure users can only access appropriate content
- Subscription validation for premium content

## Content Protection Features

### Client-Side Protection
- Disabled right-click context menu
- Blocked keyboard shortcuts (F12, Ctrl+U, etc.)
- Disabled text selection and drag operations
- Screenshot detection and warnings
- Content blur on window focus loss

### Server-Side Protection
- Authenticated access to PDF URLs
- Subscription validation before content access
- Access logging for audit trails
- Secure file storage with Supabase

## Subscription Plans

### Monthly Premium (₹299/month)
- Access to all exam papers
- Download unlimited PDFs
- Answer keys included
- Mobile app access
- Email support

### Yearly Premium (₹2,999/year)
- Everything in Monthly plan
- Priority support
- Early access to new papers
- Offline download capability
- Study progress tracking

## Security Considerations

### Content Protection Limitations
- Client-side protection can be bypassed by determined users
- For maximum security, consider:
  - Server-side PDF rendering
  - Watermarking with user information
  - DRM-protected content delivery
  - Regular security audits

### Recommended Enhancements
- Implement proper payment processing
- Add user session monitoring
- Implement IP-based access controls
- Add content watermarking
- Regular security updates

## Development

### Adding New Content
1. Add faculties through the Supabase dashboard
2. Add subjects linked to faculties
3. Upload PDF files to Supabase Storage
4. Add paper records with correct file URLs

### Customization
- Modify color schemes in `src/index.css`
- Update faculty icons in `FacultyGrid.jsx`
- Customize subscription plans in `SubscriptionModal.jsx`
- Enhance content protection in `useContentProtection.js`

## Support

For technical support or questions:
- Email: support@techlions.com
- Phone: +91 9909830513

---

© 2024 TechLions. All rights reserved.