Create a full-stack CRM project with the following structure:

BACKEND — Spring Boot 3.x + Java 21 (Maven)

- Create a Maven project at /crm-backend

- Dependencies: spring-boot-starter-web, spring-boot-starter-data-jpa,

  spring-boot-starter-security, postgresql driver, flyway-core,

  lombok, mapstruct, jjwt (io.jsonwebtoken)

- application.yml:

    server.port: 8080

    spring.datasource.url: jdbc:postgresql://localhost:5432/crm_db

    spring.datasource.username: crm_user

    spring.datasource.password: crm_pass

    spring.jpa.hibernate.ddl-auto: validate

    spring.flyway.enabled: true

    spring.flyway.locations: classpath:db/migration

- Configure CORS to allow http://localhost:4200

- Set up SecurityConfig that permits /api/auth/** and requires auth on all other /api/**

- Create a docker-compose.yml at the root with a postgres:16 service

  (db name: crm_db, user: crm_user, password: crm_pass, port 5432)

FRONTEND — Angular 17

- Create an Angular 17 project at /crm-frontend using standalone components

- Install: @angular/material, @angular/cdk, tailwindcss, ngrx/store,

  ngrx/effects, chart.js, ng2-charts

- Configure Tailwind with the Angular Material theme

- Color scheme: blue/indigo — primary #4F46E5 (indigo-600), accent #6366F1

- Create the shell layout:

    - AppComponent: sidebar + main content area (CSS grid, sidebar 240px fixed, content fills remaining)

    - SidebarComponent: logo at top, nav links (Dashboard, Contacts, Interactions)

      with active route highlighting using RouterLinkActive

    - Routes: /dashboard, /contacts, /interactions (lazy-loaded modules)

    - Responsive: sidebar collapses to bottom nav on screens < 768px

    - Use Angular Material sidenav for mobile drawer behavior

- Create placeholder components for each route (empty for now, just "Dashboard works" text)
Add database schema and full Contact CRUD to the CRM project.

DATABASE (Flyway migration scripts):

Create src/main/resources/db/migration/V1__create_contacts.sql:
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  role VARCHAR(255),
  status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','INACTIVE','LEAD','CUSTOMER')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_company ON contacts(company);
CREATE INDEX idx_contacts_name ON contacts USING gin(to_tsvector('english', name));

BACKEND:
- Contact entity (JPA) mapped to the contacts table, UUID id
- ContactRepository extends JpaRepository — add:
    Page<Contact> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email, Pageable p)
    List<Contact> findByStatus(ContactStatus status)
- ContactDTO (record), CreateContactRequest, UpdateContactRequest (with Bean Validation @NotBlank, @Email)
- ContactMapper (MapStruct) between entity and DTO
- ContactService with methods: findAll(pageable, search, status), findById, create, update, delete
- ContactController at /api/contacts:
    GET /api/contacts?page=0&size=20&search=&status=  → Page<ContactDTO>
    GET /api/contacts/{id}  → ContactDTO
    POST /api/contacts  → ContactDTO (201)
    PUT /api/contacts/{id}  → ContactDTO
    DELETE /api/contacts/{id}  → 204
- Return proper error responses (404, 400 with validation errors)

FRONTEND:
- ContactsModule (lazy loaded at /contacts)
- ContactListComponent:
    Angular Material table (mat-table) showing: name, email, company, role, status badge, actions
    Search bar (debounced 300ms, calls API)
    Status filter dropdown (All / Active / Lead / Customer / Inactive)
    Paginator (mat-paginator) wired to backend pagination
    Action buttons: Edit (pencil icon), Delete (trash icon with confirm dialog)
- ContactFormComponent (used for both create and edit):
    Reactive form with all contact fields
    mat-dialog for create/edit (opens as a modal)
    Form validation with error messages
    On save: POST or PUT to API, then refresh the list
- ContactService (Angular): HTTP calls to /api/contacts, typed with ContactDTO interface
- Status badge: color-coded chip (green=Active, blue=Lead, yellow=Customer, gray=Inactive)
Add the Interaction model and timeline feature to the CRM.

DATABASE (new Flyway migration):

Create V2__create_interactions.sql:
CREATE TABLE interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('CALL','EMAIL','MEETING','NOTE')),
  subject VARCHAR(500) NOT NULL,
  description TEXT,
  interaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER,
  outcome VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_interactions_contact_id ON interactions(contact_id);
CREATE INDEX idx_interactions_date ON interactions(interaction_date DESC);
CREATE INDEX idx_interactions_type ON interactions(type);
CREATE INDEX idx_interactions_date_week ON interactions(interaction_date)
  WHERE interaction_date >= NOW() - INTERVAL '7 days';

BACKEND:
- Interaction entity with @ManyToOne(fetch=LAZY) to Contact
- Contact entity: add @OneToMany(mappedBy="contact", cascade=ALL, orphanRemoval=true) List<Interaction>
- InteractionDTO (record with contactId, contactName for display), CreateInteractionRequest
- InteractionMapper (MapStruct)
- InteractionService:
    findByContactId(UUID contactId) → List<InteractionDTO> sorted by date DESC
    findRecent(int days) → List<InteractionDTO>
    create(CreateInteractionRequest) → InteractionDTO
    update, delete
- InteractionController at /api/interactions:
    GET /api/interactions?contactId=&days=30  → List<InteractionDTO>
    GET /api/interactions/{id}  → InteractionDTO
    POST /api/interactions  → InteractionDTO (201)
    PUT /api/interactions/{id}  → InteractionDTO
    DELETE /api/interactions/{id}  → 204

FRONTEND:
- InteractionsModule (lazy loaded at /interactions)
- InteractionTimelineComponent:
    Vertical timeline layout (CSS timeline with connector line)
    Each item shows: type icon (phone/email/meeting/note), subject, date, duration, outcome
    Type icons: use Angular Material icons (call, email, groups, note)
    Color coded by type: blue=call, green=email, purple=meeting, gray=note
    Clicking an item expands it to show full description
- ContactDetailComponent (new route /contacts/:id):
    Contact info card at top (all fields, edit button)
    "Add Interaction" button → opens InteractionFormDialog
    InteractionTimeline showing all interactions for this contact
    In the contact list, clicking a contact name navigates to /contacts/:id
- InteractionFormDialog (mat-dialog):
    Fields: type (mat-select), subject, description (textarea), date (mat-datepicker),
    duration (number input, optional), outcome (text, optional), contactId (hidden or select if from /interactions page)
- Global Interactions page (/interactions): shows all interactions across all contacts,
  filterable by type and date range
  Build the Dashboard page at /dashboard for the CRM.

BACKEND — new endpoints:

Add DashboardController at /api/dashboard:

GET /api/dashboard/summary → DashboardSummaryDTO:
{
  totalContacts: long,
  activeContacts: long,
  interactionsThisWeek: long,
  followUpsDue: long  // contacts with status=LEAD and last interaction > 7 days ago
}

GET /api/dashboard/interactions-chart?days=30 → List<DailyInteractionCountDTO>:
[{ date: "2024-01-15", count: 5 }, ...]
Query: SELECT DATE(interaction_date) as date, COUNT(*) as count
  FROM interactions
  WHERE interaction_date >= NOW() - INTERVAL '30 days'
  GROUP BY DATE(interaction_date)
  ORDER BY date ASC

GET /api/dashboard/recent-interactions?limit=5 → List<InteractionDTO>
  (most recent 5, include contact name)

GET /api/dashboard/top-contacts?limit=5 → List<TopContactDTO>:
[{ contactId, contactName, interactionCount, lastInteractionDate }, ...]
Query: SELECT contact_id, c.name, COUNT(*) as cnt, MAX(interaction_date) as last
  FROM interactions i JOIN contacts c ON c.id = i.contact_id
  GROUP BY contact_id, c.name
  ORDER BY cnt DESC
  LIMIT 5

FRONTEND — DashboardComponent:

Layout: 2-column CSS grid on desktop, 1-column on mobile

Row 1 — Summary cards (4 cards in a row):
  - Total Contacts (blue, person icon)
  - Active Contacts (green, check icon)
  - Interactions This Week (indigo, chat icon)
  - Follow-ups Due (amber, warning icon)
  Each card: large number, label, subtle icon, color-coded left border accent

Row 2 — Chart (2/3 width) + Recent Interactions (1/3 width):
  Chart: ng2-charts bar chart, "Interactions last 30 days"
    - X axis: dates, Y axis: count
    - Bar color: indigo-500 (#6366F1)
    - Match app font and color scheme
    - Chart.js options: no legend, grid lines in gray-100, tooltip showing date + count
  Recent Interactions list:
    - Each item: contact name + type icon + subject + time ago (e.g. "2 hours ago")
    - Clicking navigates to contact detail

Row 3 — Top Contacts table (full width):
  mat-table showing: rank, contact name (link to detail), company, interaction count, last interaction date
  "View all contacts" link at bottom

Use DashboardService (Angular) to call all 4 endpoints in parallel using forkJoin.
Show skeleton loading state (mat-skeleton or CSS shimmer) while data loads.
Auto-refresh every 60 seconds using RxJS timer + switchMap.
Add finishing touches to the CRM:

AUTH:
- Backend: implement POST /api/auth/login (username+password → JWT token)
  and POST /api/auth/register. Use a users table (V3 migration).
  Seed one default user: admin@crm.com / admin123
- Frontend: LoginComponent at /login (full-page, centered card)
  AuthService storing JWT in localStorage, HttpInterceptor attaching Bearer token
  AuthGuard redirecting to /login if no token, redirect to /dashboard after login

ERROR HANDLING:
- Backend: @ControllerAdvice GlobalExceptionHandler returning consistent
  { error, message, timestamp } JSON for 400/404/500
- Frontend: HTTP interceptor catching 401 (redirect to login), 
  404 (show not found snackbar), 500 (show generic error snackbar)
  Use Angular Material snackbar for all user-facing error messages

UX POLISH:
- Add loading spinners (mat-progress-spinner) on all data fetches
- Confirm dialog (mat-dialog) for all delete actions: "Delete [name]? This cannot be undone."
- Empty states: when contacts list is empty, show centered illustration + "Add your first contact" button
- Contact initials avatar: colored circle with 2-letter initials (derived from name), consistent color per contact (hash of name → one of 8 colors)
- Animate route transitions: add Angular animations with 200ms fade on router-outlet
- Breadcrumbs on contact detail page: Contacts > [Contact Name]
- Page titles using Angular's Title service (set per route)

RESPONSIVE FINAL PASS:
- Test all pages at 375px (mobile), 768px (tablet), 1280px (desktop)
- Sidebar: hidden on mobile, shown as bottom tab bar (Dashboard / Contacts / Interactions icons)
- Table on mobile: hide secondary columns (company, role), show only name + status + actions
- Dashboard cards: 2x2 grid on tablet, 1-column on mobile