# Linear Algebra Calculator - Next.js Migration

This project has been completely rewritten using:
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **shadcn/ui** for elegant components
- **Tailwind CSS** with glassmorphism theme
- **mathjs** for calculations

## Old Python/Flask Files

The following files are from the old Python/Flask implementation and can be removed:
- `app.py` - Old Flask backend
- `flask_app.py` - Flask WSGI file
- `requirements.txt` - Python dependencies
- `Dockerfile` - Old Python Docker config
- `Dockerfile.optimized` - Old optimized Docker config
- `static/` - Old static files
- `templates/` - Old Flask templates

## Migration Complete

All functionality has been migrated to the new Next.js stack with improved:
- ✅ Performance (faster calculations with mathjs)
- ✅ UI/UX (glassmorphism design with shadcn/ui)
- ✅ Type safety (full TypeScript implementation)
- ✅ Modern tooling (Next.js 15 App Router)
- ✅ Better maintainability

To start the new application:
```bash
npm install
npm run dev
```

Visit http://localhost:3000
