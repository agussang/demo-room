# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- Build: `npm run build` - Transpiles TypeScript code to JavaScript
- Typecheck: `tsc --noEmit` - Checks for TypeScript errors without emitting files

## Code Style Guidelines
- **TypeScript**: Use strict mode with proper type annotations
- **Components**: React functional components with hooks
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Imports**: Group imports by external libraries, then internal modules
- **Colors**: Use constants defined in the codebase (PRIMARY, ACCENT, etc.)
- **CSS**: Tailwind CSS utility classes for styling
- **Icons**: Use the Lucide React icon library
- **Error Handling**: Use proper error handling in async operations

## Project Structure
- `src/components`: React components
- `assets`: Static assets (CSS, images, fonts)
- Form-related pages in separate directories
- Dashboard component is the main application interface