# FIS Presents - Project Status

## Our Goal

Build a custom CMS and presentation builder for creating interactive, slide-based experiences (similar to Tiled). The system allows users to:

1. **Create Assets** - Individual presentation projects with pages
2. **Build Pages** - Use "mechanics" (reusable components) to construct interactive content
3. **View Experiences** - Public-facing viewer at `/e/[slug]` for consuming presentations
4. **Organize Work** - Workspaces to group related assets
5. **Manage Content** - Full CRUD operations on assets, pages, and mechanics

### Key Design Decisions
- **No external CMS** - Custom admin built from scratch (Payload CMS failed on Day 1)
- **File-based storage** - Using `data.json` instead of a database
- **Tiled-inspired UI** - Left sidebar for navigation, center canvas, right tools panel
- **Component-based mechanics** - Reusable React components configured via JSON

---

## Our Progress

### ✅ Completed Features

#### Authentication & Core Infrastructure
- [x] Custom authentication system using bcrypt + httpOnly cookies
- [x] Login/logout functionality at `/admin/login`
- [x] Session token verification (24h expiration)
- [x] File-based data layer with full TypeScript interfaces
- [x] CRUD operations for Users, Workspaces, Assets, Pages

#### Admin Dashboard (`/admin`)
- [x] Tiled-inspired layout with workspace sidebar (left)
- [x] Asset grid display showing cards with title, slug, status
- [x] Workspace filtering via URL params (`?workspace=ws-id`)
- [x] "New Asset" button (only shows when workspace selected)
- [x] Proper authentication guard (redirects to login)

#### Asset Creation (`/admin/assets/new`)
- [x] Form with title, slug, description, status
- [x] Auto-slug generation from title
- [x] Canvas color configuration (background + text)
- [x] Color validation (only accepts valid hex codes)
- [x] Live color preview
- [x] Workspace requirement validation
- [x] Proper form styling with visible text (dark text on white background)

#### Asset Editor (`/admin/assets/[id]`)
- [x] Three-column layout: Pages sidebar | Properties panel | Tools panel
- [x] Asset property editing (title, slug, description, status, colors)
- [x] Page creation with auto-naming (Page 1, Page 2, etc.)
- [x] Page listing in left sidebar
- [x] Delete asset with confirmation dialog
- [x] Reusable confirmation dialog system (ConfirmDialog + useConfirm hook)
- [x] Proper form styling with visible text (white text on dark background)
- [x] Save changes with validation

#### Confirmation Dialog System
- [x] `components/ui/ConfirmDialog.tsx` - Reusable confirmation modal
- [x] `components/ui/useConfirm.tsx` - Hook-based async API
- [x] Three variants: danger (red), warning (yellow), info (blue)
- [x] Keyboard support (ESC to close)
- [x] Loading state during confirmation
- [x] Documentation in `components/ui/CONFIRM_DIALOG.md`

#### API Routes
- [x] `POST /api/auth/login` - User authentication
- [x] `POST /api/auth/logout` - Session termination
- [x] `GET /api/assets` - List all assets
- [x] `POST /api/assets` - Create new asset (with nanoid ID generation)
- [x] `GET /api/assets/[id]` - Get single asset
- [x] `PATCH /api/assets/[id]` - Update asset
- [x] `DELETE /api/assets/[id]` - Delete asset
- [x] `GET /api/assets/[id]/pages` - Get pages for asset
- [x] `POST /api/assets/[id]/pages` - Create new page (with nanoid ID generation)

#### Bug Fixes Completed
- [x] Fixed input text visibility (removed global dark text override)
- [x] Fixed color validation to prevent HTML5 color input errors
- [x] Fixed missing workspace_id causing 404s
- [x] Fixed undefined asset IDs (added nanoid generation)
- [x] Fixed undefined page IDs (added nanoid generation)
- [x] Fixed API response parsing (`.asset` and `.pages` extraction)
- [x] Fixed asset editor syntax errors from corrupted JSX
- [x] Fixed text color consistency between light/dark forms

#### Data Structure
```json
{
  "users": [{ id, email, password, name, role, created_at, updated_at }],
  "workspaces": [{ id, name, slug, description, color, created_by, created_at, updated_at }],
  "assets": [{ id, workspace_id, title, slug, description, status, canvas_background_color, canvas_text_color, created_by, created_at, updated_at }],
  "pages": [{ id, asset_id, title, slug, order, mechanics, created_at, updated_at }]
}
```

### 🔧 Current Tech Stack
- **Framework**: Next.js 14.2.18 (App Directory)
- **React**: 18.3.1
- **TypeScript**: Enabled with strict mode
- **Styling**: Tailwind CSS
- **Auth**: Custom bcrypt + base64 session tokens
- **Storage**: File-based `data.json`
- **IDs**: nanoid for all entities
- **Dependencies**: bcryptjs, nanoid, react-hook-form, lucide-react, clsx, tailwind-merge

---

## Our Next Steps

### 🎯 Priority 1: Page Editor & Mechanic System
The core feature that makes this system useful.

#### Step 1: Create Mechanic Registry
- [ ] Create `lib/mechanics-registry.ts` with mechanic type definitions
- [ ] Define mechanic schema (name, props, category, icon)
- [ ] Start with 3-5 simple mechanics:
  - `Hero` - Full-screen title + subtitle
  - `TextBlock` - Rich text content
  - `ImageBlock` - Image with caption
  - `VideoEmbed` - YouTube/Vimeo embed
  - `TwoColumn` - Side-by-side layout

#### Step 2: Build Page Editor Route
- [ ] Create `/admin/pages/[id]/page.tsx`
- [ ] Top toolbar with mechanic selector (like Tiled's tool palette)
- [ ] Main canvas area showing page preview
- [ ] Right sidebar for selected mechanic's properties
- [ ] Add mechanic button (opens mechanic picker)
- [ ] Drag-to-reorder mechanics
- [ ] Delete mechanic with confirmation
- [ ] Save mechanics as JSON string in `page.mechanics`

#### Step 3: Implement Mechanic Components
- [ ] Create basic mechanic components in `components/mechanics/`
- [ ] Each mechanic accepts props from JSON configuration
- [ ] Render mode switch: `edit` vs `view`
- [ ] In edit mode: show toolbars, handles, visual editing
- [ ] In view mode: clean presentation output

#### Step 4: Build Mechanic Property Editor
- [ ] Dynamic form based on mechanic type
- [ ] Text inputs, textareas, color pickers, file uploads
- [ ] Live preview updates as properties change
- [ ] Validation for required fields

### 🎯 Priority 2: Public Viewer
Make presentations viewable to end users.

#### Step 1: Asset Viewer Route
- [ ] Create `/e/[slug]/page.tsx`
- [ ] Fetch asset by slug
- [ ] Load all pages for asset
- [ ] Apply canvas background/text colors
- [ ] Full-screen layout

#### Step 2: Page Navigation
- [ ] Keyboard navigation (arrow keys, space)
- [ ] Page indicators/dots
- [ ] Optional progress bar
- [ ] URL hash for deep linking to pages
- [ ] Navigation arrows (left/right)

#### Step 3: Mechanic Rendering
- [ ] Parse `page.mechanics` JSON
- [ ] Render mechanic components in order
- [ ] Handle errors gracefully (invalid JSON, missing mechanics)
- [ ] Smooth transitions between pages

### 🎯 Priority 3: Enhanced Asset Management

#### Workspace Management
- [ ] Create `/admin/workspaces/new` page
- [ ] Workspace creation form (name, slug, description, color)
- [ ] `POST /api/workspaces` endpoint
- [ ] Edit workspace functionality
- [ ] Delete workspace (with asset reassignment/warning)

#### Asset Features
- [ ] Duplicate asset functionality
- [ ] Asset search/filter in dashboard
- [ ] Sort assets (by date, name, status)
- [ ] Asset thumbnails/preview images
- [ ] View count tracking (optional)

#### Page Management
- [ ] Edit page properties (title, slug)
- [ ] Reorder pages (drag-and-drop)
- [ ] Delete page with confirmation
- [ ] Duplicate page functionality
- [ ] Page status (draft/published)

### 🎯 Priority 4: Quality of Life Improvements

#### UI/UX
- [ ] Better error messages throughout
- [ ] Loading states for all async operations
- [ ] Success toasts for save/delete actions
- [ ] Keyboard shortcuts (Ctrl+S to save, etc.)
- [ ] Breadcrumb navigation
- [ ] Recent assets list

#### Data Management
- [ ] Data export functionality
- [ ] Data import/backup
- [ ] Asset templates
- [ ] Bulk operations (delete multiple, status change)

#### Developer Experience
- [ ] Add proper error logging
- [ ] Add data validation middleware
- [ ] Consider migration to real database (PostgreSQL?)
- [ ] Add automated tests
- [ ] API documentation

---

## Known Issues & Technical Debt

### Current Limitations
- **File-based storage** - Won't scale beyond ~100 assets without performance issues
- **No media upload** - Need to add file upload system for images/videos
- **No rich text editor** - Text inputs are plain text only
- **No user management UI** - Users can only be added manually to `data.json`
- **No permissions system** - All logged-in users have full access
- **No version history** - Changes are permanent, no undo/rollback

### Files That Need Cleanup
- `payload.config.ts` - Leftover from failed Payload CMS attempt (can delete)
- `lib/BlockRenderer.tsx` - Old mechanic rendering system (can refactor or remove)
- `components/mechanics/*` - Many mechanic components exist but aren't integrated yet
- `MECHANIC_EXAMPLES.json` - Example data from old system

### Naming Inconsistencies
- Database uses `canvas_background_color` (snake_case)
- Some code uses `canvasBgColor` (camelCase)
- Some code uses `canvasBackgroundColor` (camelCase)
- **Recommendation**: Standardize on snake_case for database, camelCase for TypeScript

---

## Quick Start Commands

```bash
# Start development server
npm run dev

# Login credentials (from data.json)
Email: admin@fis.com
Password: password

# Generate new password hash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 10).then(hash => console.log(hash))"

# Access points
Dashboard: http://localhost:3000/admin
Login: http://localhost:3000/admin/login
Create Asset: http://localhost:3000/admin/assets/new
Edit Asset: http://localhost:3000/admin/assets/[id]
```

---

## File Structure Reference

```
app/
  admin/
    page.tsx              # Main dashboard
    login/page.tsx        # Login form
    assets/
      new/page.tsx        # Create asset form
      [id]/page.tsx       # Edit asset (3-column layout)
  api/
    auth/
      login/route.ts      # POST login
      logout/route.ts     # POST logout
    assets/
      route.ts            # GET/POST assets
      [id]/
        route.ts          # GET/PATCH/DELETE asset
        pages/route.ts    # GET/POST pages
  e/
    [slug]/page.tsx       # Public viewer (TODO)
  globals.css             # Global styles (removed !important rule)

components/
  ui/
    ConfirmDialog.tsx     # Reusable confirmation modal
    useConfirm.tsx        # Hook for confirmation dialogs
    CONFIRM_DIALOG.md     # Documentation
  mechanics/              # Mechanic components (need integration)
  viewer/                 # Viewer components (need work)

lib/
  data.ts                 # Data access layer (CRUD operations)
  auth.ts                 # Authentication utilities
  utils.ts                # Utility functions
  id.ts                   # ID generation (nanoid)

db/
  schema.ts               # Database schema (old, not used)
  index.ts                # Database exports (old, not used)

data.json                 # Main data file
```

---

## Context for Next Session

**Where We Left Off:**
- Just finished fixing text color visibility issues across all forms
- Asset editor is fully functional with delete capability
- All core CRUD operations working for assets
- Ready to start building the page editor and mechanic system

**What to Focus On Next:**
1. Build the page editor UI (`/admin/pages/[id]`)
2. Create a simple mechanic registry
3. Implement 3-5 basic mechanics (Hero, TextBlock, ImageBlock, etc.)
4. Get mechanics rendering in the page editor
5. Build the public viewer route (`/e/[slug]`)

**Key Files to Know:**
- `lib/data.ts` - All database operations
- `app/admin/assets/[id]/page.tsx` - Asset editor (reference for page editor)
- `components/ui/ConfirmDialog.tsx` - Reusable confirmation system
- `data.json` - The entire database

**Testing Workflow:**
1. Login at `/admin/login` (admin@fis.com / password)
2. Create asset at `/admin/assets/new`
3. Edit asset at `/admin/assets/[id]`
4. Create pages in asset editor
5. Next: Build page editor to add mechanics to pages
