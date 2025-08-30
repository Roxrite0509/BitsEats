# BITS Eats - Multi-Vendor Food Delivery Platform

## Overview

BITS Eats is a comprehensive multi-vendor food delivery web application specifically designed for the BITS Goa campus. The platform facilitates food ordering from various campus eateries with role-based access control, featuring distinct dashboards for users, vendors, and administrators. Built with modern web technologies, the application emphasizes security, scalability, and user experience with a dark-themed interface optimized for the campus ecosystem.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React-based SPA**: Built with React and TypeScript for type safety and modern development practices
- **Routing**: Uses Wouter for lightweight client-side routing with role-based navigation
- **UI Framework**: Implements shadcn/ui component library with Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS custom properties for theming and dark mode support
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Node.js/Express**: RESTful API server with Express.js framework
- **Authentication**: Replit-based OIDC authentication with session management
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple
- **Middleware**: Custom logging, error handling, and role-based authorization middleware
- **API Design**: Resource-based REST endpoints with proper HTTP status codes and error handling

### Database Layer
- **Database**: Neon PostgreSQL for cloud-hosted, serverless database
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Schema**: Comprehensive relational schema supporting users, vendors, menu items, orders, and reviews
- **Migrations**: Database versioning with Drizzle Kit for schema evolution

### Authentication & Authorization
- **OIDC Integration**: OpenID Connect with Replit for secure authentication
- **Role-based Access**: Three-tier role system (user, vendor, admin) with granular permissions
- **Session Management**: Secure session handling with HTTP-only cookies and proper expiration
- **Security**: CSRF protection, secure headers, and input validation

### Data Models
- **Users**: Profile management with role assignment and campus-specific fields (hostel room)
- **Vendors**: Restaurant/eatery profiles with location, ratings, and operational status
- **Menu System**: Hierarchical categories and items with pricing, availability, and dietary information
- **Orders**: Complete order lifecycle tracking with status updates and item details
- **Reviews**: User feedback system with ratings and vendor responses

### File Organization
- **Monorepo Structure**: Client, server, and shared code in organized directories
- **Shared Schema**: Common TypeScript types and Zod validation schemas
- **Component Architecture**: Modular UI components with clear separation of concerns
- **Route Organization**: RESTful API routes with proper middleware composition

## External Dependencies

### Database & ORM
- **Neon PostgreSQL**: Serverless PostgreSQL database for data persistence
- **Drizzle ORM**: Type-safe database toolkit for schema management and queries
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Authentication
- **Replit OIDC**: OpenID Connect integration for user authentication
- **Passport.js**: Authentication middleware for Node.js applications

### Frontend Libraries
- **React**: Core UI library with hooks and modern patterns
- **TanStack Query**: Server state management and data fetching
- **Wouter**: Lightweight routing library for React applications
- **shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling

### Development Tools
- **TypeScript**: Static typing for enhanced developer experience
- **Vite**: Build tool and development server
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### Validation & Utilities
- **Zod**: Schema validation for runtime type checking
- **React Hook Form**: Form handling with validation integration
- **date-fns**: Date manipulation and formatting utilities
- **clsx**: Conditional className utility for dynamic styling