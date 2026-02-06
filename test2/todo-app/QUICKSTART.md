# Frontend Quickstart Guide

## Prerequisites
- Node.js 18+ installed
- pnpm/yarn/npm package manager
- Access to backend API (Next.js server)

## Setup Instructions

### 1. Clone and Navigate
```bash
cd frontend/todo-app
```

### 2. Install Dependencies
```bash
pnpm install  # or yarn install or npm install
```

### 3. Environment Configuration
Create `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key
```

### 4. Run Development Server
```bash
pnpm dev  # or yarn dev or npm run dev
```

Application will be available at http://localhost:3000

## Key Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build production application
- `pnpm start` - Start production server
- `pnpm lint` - Run linter
- `pnpm test` - Run tests

## Project Structure Overview

```
frontend/todo-app/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── lib/                # Utilities and API client
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
├── config/             # Configuration files
└── public/             # Static assets
```

## Key Technologies Used

- **Framework**: Next.js 16+ with App Router
- **Styling**: Tailwind CSS with custom configuration
- **Animations**: Framer Motion
- **Theming**: next-themes for light/dark mode
- **UI Components**: Custom-built with Tailwind CSS
- **Type Safety**: TypeScript strict mode
- **Authentication**: JWT-based authentication
- **Forms**: react-hook-form with Zod validation

## Development Guidelines

1. **Component Organization**: Place reusable components in `components/`
2. **Server Components**: Use for data fetching and static content
3. **Client Components**: Use only for interactivity with `'use client'` directive
4. **API Calls**: Route all API calls through `lib/api.ts`
5. **Types**: Define TypeScript interfaces in `types/` directory
6. **Hooks**: Create custom hooks in `hooks/` directory for reusable logic

## Available Features

- Authentication (Sign In/Sign Up)
- Task Management (Create, Read, Update, Delete)
- Light/Dark Theme Support
- Responsive Design
- Form Validation
- Toast Notifications
- Loading States
- Error Handling
- Accessibility Features (WCAG 2.1 AA)