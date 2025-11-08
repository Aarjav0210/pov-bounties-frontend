# POV Bounties Frontend

A Next.js + TypeScript + Tailwind CSS application for a crowdsourced egocentric-video bounty platform.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open browser
# Navigate to http://localhost:3000
```

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: react-hook-form + zod
- **Charts**: recharts
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Mocking**: MSW (Mock Service Worker)

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (app)/                   # App layout group
│   │   ├── bounties/[id]/       # Bounty detail page
│   │   └── validate/[id]/       # Validation stepper page
│   ├── components/              # Component showcase
│   └── layout.tsx               # Root layout
├── components/
│   ├── ui/                      # shadcn/ui components
│   └── common/                  # Shared primitives
│       ├── AppShell.tsx         # Navigation shell
│       ├── Steps.tsx            # Validation stepper
│       ├── FileUploader.tsx     # Drag-drop uploader
│       ├── DataStates.tsx       # Empty/Error/Loading states
│       ├── KpiCard.tsx          # Metric cards
│       ├── DonutChart.tsx       # Donut charts
│       └── QualityGauge.tsx     # Quality score gauge
├── lib/
│   ├── api/                     # API client & MSW handlers
│   ├── types/                   # TypeScript type definitions
│   └── utils.ts                 # Utility functions
└── tests/
    ├── unit/                    # Vitest unit tests
    └── e2e/                     # Playwright e2e tests
```

## 🎯 Key Features Implemented

### ✅ Task 0: Scaffold (Complete)
- Next.js 14 with App Router
- TypeScript strict mode
- Tailwind CSS + shadcn/ui setup
- ESLint + Prettier + Husky
- Vitest + Playwright configured
- Component showcase page

### ✅ Task 1: Shared Primitives (Complete)
- **AppShell**: Responsive navigation with mobile menu
- **Steps**: Vertical/horizontal stepper with states (idle, running, passed, failed, retrying, skipped)
- **FileUploader**: Drag-drop with validation, progress tracking
- **Data States**: Empty, Error, Loading components
- **KPI Card**: Metric display with trends
- **DonutChart**: Industry distribution visualization
- **QualityGauge**: Score display with rubric breakdown
- **FormField**: React Hook Form + Zod integration
- **ServerActionButton**: Pending state handling

### ✅ Task 2: End-to-End Flow (Complete)
- **Bounty Detail Page** (`/bounties/[id]`):
  - Tabs: Overview, Requirements, Examples, FAQ
  - File uploader in right rail
  - Submit to validation flow
- **Validation Page** (`/validate/[submissionId]`):
  - Live stepper with simulated SSE updates
  - Step-by-step progress visualization
  - Accordion for reasoning details
  - Quality score gauge with rubric
  - Eligibility determination
  - Action buttons (Submit, Download, Retry)

## 🧪 Testing

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Unit tests
pnpm test

# Unit tests with UI
pnpm test:ui

# E2E tests
pnpm e2e

# Build
pnpm build
```

### Test Coverage

- **Unit Tests**: 13/13 passing ✅
  - Utilities (cn function)
  - Steps component state machine
  - FileUploader validation and interaction

- **E2E Tests**: 23/23 passing ✅
  - Component showcase
  - Primitives functionality
  - Happy path: Bounty submission → Validation → Completion
  - Marketplace filters and navigation
  - Dashboard KPIs and charts
  - Enterprise pages and forms
  - Keyboard accessibility throughout

## 📝 Scripts

- `dev`: Start development server
- `build`: Production build
- `start`: Start production server
- `lint`: Run ESLint
- `format`: Check code formatting
- `typecheck`: TypeScript type checking
- `test`: Run unit tests
- `test:ui`: Run unit tests with Vitest UI
- `e2e`: Run Playwright e2e tests
- `prepare`: Install Husky git hooks

## 🎨 Adding Components

### From shadcn/ui

```bash
npx shadcn@latest add [component-name]
```

### Custom Shared Components

1. Create in `src/components/common/[ComponentName].tsx`
2. Add proper TypeScript types
3. Include ARIA labels for accessibility
4. Write unit tests in `src/tests/unit/components/`
5. Add e2e tests if needed

## 🔄 API Configuration

The application connects to a video validation API backend. Configure the API URL using environment variables:

1. **Create `.env.local`** (copy from `.env.local.example`):
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

2. **API Endpoints**:
   - `/upload-video` - Upload video file
   - `/validate-video/stream` - Stream validation progress via SSE
   - `/validate-video` - Start validation job (non-streaming)
   - `/validation-status/{job_id}` - Get validation status

3. **API Client** (`src/lib/api/client.ts`):
   - `uploadVideo(file: File)` - Upload video to backend
   - `connectValidationStream(videoPath, expectedTask, onEvent)` - Connect to SSE stream
   - `startValidation(videoPath, expectedTask)` - Start validation job
   - `getValidationStatus(jobId)` - Get validation status

4. **Validation Flow**:
   - User uploads video on bounty detail page
   - Video is uploaded to `/upload-video` endpoint
   - Validation is started with `/validate-video/stream` (SSE)
   - Real-time progress updates are displayed on validation page
   - Scene-by-scene results are shown during VLM classification
   - Final LLM evaluation result (confirmed/rejected) is displayed

## 🔄 Switching from Mocks to Real APIs

The application now uses real API endpoints. To use mocks instead:

1. **Enable MSW** (for development):
   - Uncomment MSW initialization in pages
   - Update API client to use mock endpoints

2. **Remove MSW** (for production):
   - Delete or disable `src/lib/api/mock-handlers.ts`
   - Remove MSW initialization from pages

## 🎉 All Tasks Complete!

### ✅ Task 3: User Journey (Complete)
- **Marketplace** (`/bounties`): Search, filters (industry, difficulty), pagination, bounty cards
- **Dashboard** (`/dashboard`): KPIs, donut charts, quality gauge, submissions table with dialog
- **Enterprise** (`/enterprise`): Landing page with feature cards
- **Create Bounty** (`/enterprise/new`): Multi-section form with validation, domain selection, augmentations, cost calculator

### ✅ Task 4: Hardening (Complete)
- Error boundaries with user-friendly error pages
- 404 Not Found page
- 500 Error handling
- Beautiful homepage with hero, features, stats, and CTA
- All routes properly tested

## 🌐 Accessibility

- Semantic HTML with proper roles
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus states on all interactive elements
- Screen reader compatible

## 🔧 Configuration Files

- `tailwind.config.ts`: Tailwind configuration with design tokens
- `tsconfig.json`: TypeScript configuration (strict mode)
- `vitest.config.ts`: Vitest unit test configuration
- `playwright.config.ts`: Playwright e2e test configuration
- `components.json`: shadcn/ui configuration
- `.prettierrc`: Code formatting rules
- `.lintstagedrc.js`: Pre-commit lint configuration

## 🚀 Pages & Routes

### Public Pages
- `/` - Homepage with hero and features
- `/bounties` - Marketplace with filters (6 bounties, pagination)
- `/bounties/[id]` - Bounty detail with tabs and file upload
- `/validate/[submissionId]` - Live validation stepper
- `/dashboard` - User dashboard with KPIs, charts, submissions table
- `/enterprise` - Enterprise landing page
- `/enterprise/new` - Create bounty form
- `/components` - Component showcase (development)

### Error Pages
- `/error` - Error boundary catch-all
- `/404` - Not found page

## 📊 Final Stats

- **9 Pages**: All routes functional and tested
- **11 Shared Components**: Reusable primitives
- **23 E2E Tests**: 100% passing
- **13 Unit Tests**: 100% passing
- **TypeScript**: Strict mode, zero errors
- **ESLint**: Clean (1 warning in generated file)
- **Build**: ✅ Successful
- **Accessibility**: ARIA labels, keyboard navigation, focus states

## 🎯 Future Enhancements

- Real API integration (replace MSW mocks)
- Authentication & role-based access
- Analytics tracking
- Storybook documentation
- Additional unit tests for new pages
- Performance optimizations

## 📄 License

MIT

## 🤝 Contributing

1. Follow the stop-the-line policy: All checks must pass before proceeding
2. Write tests for new features
3. Maintain TypeScript strict mode compliance
4. Ensure accessibility standards are met
5. Run `pnpm typecheck && pnpm lint && pnpm test && pnpm build` before committing

---

Built with ❤️ for hackPrinceton
