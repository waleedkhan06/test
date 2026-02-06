# Outstanding Todo App

A modern, stunning todo application with premium UX built with Next.js, TypeScript, Tailwind CSS, and more.

## Features

- 🎨 Beautiful UI with light/dark themes
- 🔐 Authentication (Sign In/Sign Up)
- ✅ Task Management (Create, Read, Update, Delete)
- 📱 Fully Responsive Design
- ♿ Accessibility compliant (WCAG 2.1 AA)
- ⚡ Fast Performance
- 🔄 Smooth Animations
- 🔍 Form Validation

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with semantic tokens
- **Animations**: Framer Motion
- **Theming**: next-themes
- **UI**: Custom components with Tailwind
- **Forms**: react-hook-form with Zod validation
- **Icons**: Lucide React

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   BETTER_AUTH_SECRET=your-secret-key
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000` in your browser.

## Project Structure

```
frontend/todo-app/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── task/              # Task management components
│   ├── theme/             # Theme components
│   └── ui/                # Base UI components
├── lib/                   # Utilities and API client
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript definitions
├── config/                # Configuration files
└── public/                # Static assets
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
