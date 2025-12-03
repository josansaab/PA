# Personal Smart Dashboard

## Overview

This is a full-stack personal dashboard application designed for daily life management. The application helps users track tasks, bills, subscriptions, car maintenance, kids' events, and notes. It's built to run locally on a VPS (Proxmox container) and be accessed remotely using Cloudflare Tunnel.

The application provides a comprehensive view of personal management needs including:
- Task management with categories and priorities
- Bills tracking with due dates and payment status
- Subscription renewals monitoring
- Car maintenance and service scheduling
- Kids' events and calendar
- Quick notes and ideas
- Voice input capability using Web Speech API

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Framework**: The application uses shadcn/ui component library with Radix UI primitives for accessible, composable components. The design follows a modern glassmorphic/neumorphic aesthetic with TailwindCSS for styling.

**State Management**: TanStack Query (React Query) handles all server state management, providing caching, background updates, and optimistic updates for a smooth user experience.

**Routing**: Wouter is used for lightweight client-side routing, supporting all major pages (Dashboard, Tasks, Bills, Subscriptions, Car, Kids Events, Notes, Settings).

**Theming**: next-themes provides dark/light mode support with system preference detection.

**Design Patterns**:
- Component composition with shadcn/ui patterns
- Custom hooks for reusable logic (useDebounce, useMobile, useToast)
- Centralized API layer in `client/src/lib/api.ts`
- Shared TypeScript types between frontend and backend via the `@shared` alias

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js

**API Design**: RESTful API pattern with resource-based endpoints:
- `/api/tasks` - Task CRUD operations
- `/api/bills` - Bills management
- `/api/subscriptions` - Subscription tracking
- `/api/cars` and `/api/car-services` - Vehicle maintenance
- `/api/kids-events` - Children's events
- `/api/notes` - Personal notes storage
- `/api/dashboard/upcoming-payments` - Aggregated payment data

**Validation**: Zod schemas provide runtime type validation for all API inputs, with drizzle-zod integration for database schema validation.

**Build System**: Custom esbuild-based build process bundles the server with selected dependencies for optimized cold start times in production.

**Development**: Vite dev server in middleware mode provides HMR and fast refresh during development.

### Data Storage

**Database**: PostgreSQL accessed via Neon's serverless driver (`@neondatabase/serverless`)

**ORM**: Drizzle ORM provides type-safe database access with the schema defined in `shared/schema.ts`

**Schema Design**:
- `users` - Authentication (username/password)
- `tasks` - Task items with category, priority, due dates
- `bills` - Bill tracking with amounts, providers, status
- `subscriptions` - Recurring subscriptions with renewal dates
- `cars` - Vehicle information
- `car_services` - Service history and schedules
- `kids_events` - Children's event calendar
- `notes` - Simple note storage (single record pattern)

**Migrations**: Drizzle Kit manages schema migrations with files stored in `/migrations`

**Storage Layer**: Abstracted through `server/storage.ts` which implements an IStorage interface, making it easy to swap implementations or add caching layers.

### External Dependencies

**Database Service**: Neon PostgreSQL (serverless PostgreSQL platform)
- Connection via `@neondatabase/serverless` driver
- Configured through `DATABASE_URL` environment variable
- Drizzle ORM provides the abstraction layer

**Replit-Specific Services**:
- `@replit/vite-plugin-runtime-error-modal` - Development error overlay
- `@replit/vite-plugin-cartographer` - Development tooling
- `@replit/vite-plugin-dev-banner` - Development banner
- Custom `vite-plugin-meta-images` - Updates OpenGraph meta tags with Replit deployment URLs

**Date Handling**: date-fns library for date manipulation and formatting

**Web APIs**:
- Web Speech API - Voice input functionality (browser-native)
- Placeholder for weather API integration

**Future Integrations** (Infrastructure Ready):
- Email notifications (nodemailer in dependencies)
- AI/Voice assistant capabilities (placeholder infrastructure)
- File attachments for bills (multer in dependencies)