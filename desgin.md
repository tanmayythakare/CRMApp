Refactor the global design system and sidebar. Replace all existing global styles.

TYPOGRAPHY:
- Import Google Fonts: 'Plus Jakarta Sans' (weights 400, 500, 600, 700) for body/UI
- Import 'DM Serif Display' for large headings (page titles, big numbers)
- Set in styles.scss:
    font-family: 'Plus Jakarta Sans', sans-serif
    All h1/h2 page titles: font-family: 'DM Serif Display', serif; font-weight: 400

COLOR SYSTEM — replace all CSS variables in styles.scss:
    --indigo-50: #EEF2FF
    --indigo-100: #E0E7FF
    --indigo-200: #C7D2FE
    --indigo-400: #818CF8
    --indigo-500: #6366F1
    --indigo-600: #4F46E5
    --indigo-700: #4338CA
    --indigo-900: #1E1B4B
    --gray-50: #F8FAFC
    --gray-100: #F1F5F9
    --gray-200: #E2E8F0
    --gray-300: #CBD5E1
    --gray-400: #94A3B8
    --gray-500: #64748B
    --gray-600: #475569
    --gray-700: #334155
    --gray-800: #1E293B
    --gray-900: #0F172A
    --green-500: #22C55E
    --amber-500: #F59E0B
    --red-500: #EF4444
    --surface: #FFFFFF
    --bg: #F0F2F8           ← slightly blue-tinted background, not neutral gray
    --sidebar-bg: #1E1B4B   ← deep indigo sidebar (dark)

BODY:
    background: var(--bg)
    color: var(--gray-800)

SIDEBAR — full redesign (dark indigo sidebar):
    width: 256px
    background: var(--indigo-900)  (#1E1B4B)
    padding: 0
    display: flex; flex-direction: column
    border-right: none
    box-shadow: 4px 0 24px rgba(0,0,0,0.12)

    LOGO AREA (top section):
        padding: 24px 20px 20px
        border-bottom: 1px solid rgba(255,255,255,0.08)
        Logo icon: 40px square, background: var(--indigo-500), border-radius: 10px
        "CRM Hub" text: color: white, font-size: 18px, font-weight: 700, letter-spacing: -0.3px
        margin-left: 12px from icon

    NAV LINKS:
        padding: 16px 12px
        gap: 4px between items
        Each nav item:
            padding: 10px 12px
            border-radius: 10px
            display: flex; align-items: center; gap: 12px
            color: rgba(255,255,255,0.55)
            font-size: 14px; font-weight: 500
            cursor: pointer; transition: all 0.18s ease
            mat-icon: 20px, color: inherit
        Hover state:
            background: rgba(255,255,255,0.07)
            color: rgba(255,255,255,0.85)
        Active state (routerLinkActive):
            background: var(--indigo-600)
            color: white
            font-weight: 600
            box-shadow: 0 4px 12px rgba(99,102,241,0.35)
            mat-icon: color: white

    USER PROFILE (bottom):
        margin-top: auto
        padding: 16px 12px
        border-top: 1px solid rgba(255,255,255,0.08)
        Avatar: 34px circle, background: var(--indigo-500), initials in white, font-size: 13px
        Name: color: white, font-size: 13px, font-weight: 600
        Email: color: rgba(255,255,255,0.45), font-size: 12px
        Menu icon: color: rgba(255,255,255,0.4)

MAIN CONTENT AREA:
    background: var(--bg)
    padding: 32px 36px
    min-height: 100vh
    Redesign the Contacts page with production-grade polish.

PAGE HEADER:
    "Contacts" — font-family: 'DM Serif Display'; font-size: 32px; font-weight: 400; color: var(--gray-900); margin: 0
    Subtitle: "Manage and track your customer relationships"
        font-size: 14px; color: var(--gray-500); margin-top: 4px
    "+ Add Contact" button:
        background: var(--indigo-600)
        color: white
        padding: 10px 20px
        border-radius: 10px
        font-size: 14px; font-weight: 600
        border: none
        box-shadow: 0 4px 14px rgba(79,70,229,0.35)
        transition: all 0.18s
        Hover: background: var(--indigo-700), box-shadow: 0 6px 20px rgba(79,70,229,0.45), transform: translateY(-1px)
        Active: transform: translateY(0)
        Icon: mat-icon "add" at 18px, margin-right: 6px

FILTER BAR (card below header, margin-top: 24px):
    background: white
    border-radius: 14px
    padding: 16px 20px
    box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)
    display: flex; gap: 12px; align-items: center

    Search input:
        flex: 1
        height: 42px
        border: 1.5px solid var(--gray-200)
        border-radius: 10px
        padding: 0 14px 0 40px
        font-size: 14px
        background: var(--gray-50)
        Prefix search icon: position absolute, left 12px, color: var(--gray-400), size 18px
        Focus: border-color: var(--indigo-400), background: white, box-shadow: 0 0 0 3px rgba(99,102,241,0.12)
        transition: all 0.15s

    Status select (mat-select):
        width: 160px
        height: 42px
        border: 1.5px solid var(--gray-200)
        border-radius: 10px
        padding: 0 14px
        font-size: 14px
        background: var(--gray-50)
        appearance: none

CONTACTS TABLE (card below filter bar, margin-top: 16px):
    background: white
    border-radius: 14px
    box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)
    overflow: hidden

    TABLE HEADER ROW:
        background: var(--gray-50)
        border-bottom: 1.5px solid var(--gray-100)
        Column headers: font-size: 11px; font-weight: 700; text-transform: uppercase;
            letter-spacing: 0.7px; color: var(--gray-400); padding: 14px 20px

    TABLE DATA ROWS:
        padding: 0 20px
        min-height: 72px
        border-bottom: 1px solid var(--gray-100)
        Last row: no border-bottom
        transition: background 0.12s
        Hover: background: var(--indigo-50)

        AVATAR COLUMN:
            Circle 40px, border-radius: 50%
            Colors for initials (hash-based): 8 color pairs:
                JD: background #FEE2E2, color #DC2626 (red)
                JS: background #DBEAFE, color #2563EB (blue)
                RB: background #D1FAE5, color #059669 (green)
                etc — use 8 distinct hues cycling
            Initials: font-size: 14px; font-weight: 700

        NAME COLUMN:
            Name: font-size: 14px; font-weight: 600; color: var(--gray-900)
            Email: font-size: 12px; color: var(--gray-400); margin-top: 2px
            Clicking the name navigates to /contacts/:id
            Name is a link: hover color: var(--indigo-600), no underline by default,
            underline on hover

        COMPANY COLUMN:
            Company name: font-size: 14px; font-weight: 500; color: var(--gray-700)
            Role: font-size: 12px; color: var(--gray-400); margin-top: 2px

        STATUS COLUMN — replace mat-chip with custom badges:
            ACTIVE:   background: #D1FAE5; color: #065F46; border: 1px solid #A7F3D0
            LEAD:     background: #DBEAFE; color: #1E40AF; border: 1px solid #BFDBFE
            CUSTOMER: background: #EDE9FE; color: #5B21B6; border: 1px solid #DDD6FE
            INACTIVE: background: #F1F5F9; color: #475569; border: 1px solid #E2E8F0
            All badges: font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
                text-transform: uppercase; padding: 4px 10px; border-radius: 20px;
                display: inline-block

        ACTIONS COLUMN:
            Replace the ⋮ icon button with two explicit icon buttons side by side:
            Edit button: mat-icon-button, icon "edit", color: var(--gray-400)
                hover: color: var(--indigo-600), background: var(--indigo-50)
            Delete button: mat-icon-button, icon "delete_outline", color: var(--gray-400)
                hover: color: var(--red-500), background: #FEF2F2
            Both buttons: border-radius: 8px; transition: all 0.15s

    PAGINATOR:
        padding: 12px 20px
        border-top: 1.5px solid var(--gray-100)
        font-size: 13px; color: var(--gray-500)
        background: var(--gray-50)

EMPTY STATE (when no contacts):
    Center vertically and horizontally in the table card
    SVG illustration of empty clipboard (simple geometric, indigo tones)
    "No contacts found" — font-size: 18px; font-weight: 600; color: var(--gray-700)
    "Try adjusting your search or add a new contact"
        font-size: 14px; color: var(--gray-400); margin-top: 8px
    "+ Add Contact" button (same style as header button)
    padding: 64px 0
    Redesign the Dashboard page with refined, information-dense layout.

PAGE HEADER:
    Left: "Overview" in DM Serif Display, 32px, gray-900
    Right: auto-refresh indicator:
        Small pill: background: var(--indigo-50); border: 1px solid var(--indigo-200)
        border-radius: 20px; padding: 6px 14px
        Icon: mat-icon "refresh" at 14px, color: var(--indigo-500), spinning animation (2s linear infinite, paused — only plays during fetch)
        Text: "Auto-refreshing every 60s", font-size: 12px; color: var(--indigo-600); font-weight: 500

SUMMARY CARDS (row of 4, margin-top: 28px):
    Display: CSS grid, 4 columns, gap: 16px
    Each card:
        background: white
        border-radius: 16px
        padding: 24px
        box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)
        position: relative; overflow: hidden
        Animated entrance: fadeInUp 0.4s ease, staggered (delay 0s, 0.08s, 0.16s, 0.24s)

        TOP ROW: label text left, icon container right
            Label: font-size: 11px; font-weight: 700; text-transform: uppercase;
                letter-spacing: 0.8px; color: var(--gray-400)
            Icon container: 44px square, border-radius: 12px, centered icon 22px
                Card 1 (Total Contacts):  background: #EEF2FF, icon color: var(--indigo-600)
                Card 2 (Active Contacts): background: #D1FAE5, icon color: #059669
                Card 3 (Interactions LW): background: #EEF2FF, icon color: var(--indigo-500)
                Card 4 (Follow-ups Due):  background: #FEF3C7, icon color: #D97706

        BOTTOM ROW (margin-top: 16px):
            Value: font-family: 'DM Serif Display'; font-size: 36px; font-weight: 400; color: var(--gray-900)
            Trend sub-label (below value, optional):
                font-size: 12px; color: var(--green-500); font-weight: 500
                e.g. "↑ 12% this month" — add for Active Contacts and Interactions

        DECORATIVE: subtle geometric accent in bottom-right corner
            SVG circle or arc, color matching icon container, opacity: 0.15, position: absolute, right: -10px, bottom: -10px, size 60px

CHART + RECENT ACTIVITY ROW (margin-top: 24px):
    CSS grid: 1fr 340px, gap: 20px

    CHART CARD (left):
        background: white; border-radius: 16px; padding: 24px
        box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)

        Chart header:
            Title: "Interactions — last 30 days", font-size: 16px; font-weight: 600; color: var(--gray-800)
            Sub: total count "248 total", font-size: 13px; color: var(--gray-400); margin-left: 12px
            Right side: pill tabs for 7d / 30d / 90d
                Each tab: border: 1px solid var(--gray-200), border-radius: 8px, padding: 5px 12px
                font-size: 12px; font-weight: 500; color: var(--gray-500); cursor: pointer
                Active tab: background: var(--indigo-600); color: white; border-color: transparent

        Chart.js bar chart:
            height: 240px
            Bar color: var(--indigo-500) with 90% opacity
            Bar hover color: var(--indigo-700)
            Bar border-radius: 6px (Chart.js borderRadius option)
            Grid lines: color: var(--gray-100), lineWidth: 1
            X-axis labels: font-size: 11px, color: var(--gray-400)
            Y-axis labels: font-size: 11px, color: var(--gray-400)
            No legend
            Tooltip: custom styled — white background, border-radius: 8px,
                padding: 10px 14px, box-shadow: 0 4px 12px rgba(0,0,0,0.12)
                font: Plus Jakarta Sans 12px

    RECENT ACTIVITY CARD (right):
        background: white; border-radius: 16px; padding: 24px
        box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)

        Header: "Recent Activity", font-size: 16px; font-weight: 600; color: var(--gray-800)
        Icon: mat-icon "history" at 18px, color: var(--indigo-500), margin-right: 8px

        Each activity item (gap: 0, divider between):
            padding: 14px 0
            border-bottom: 1px solid var(--gray-100); last item no border
            Display: flex, gap: 12px

            Left icon (40px circle):
                CALL:    background: #DBEAFE, icon "call", color: #2563EB
                EMAIL:   background: #D1FAE5, icon "email", color: #059669
                MEETING: background: #EDE9FE, icon "groups", color: #7C3AED
                NOTE:    background: #FEF3C7, icon "sticky_note_2", color: #D97706

            Middle:
                Contact name: font-size: 14px; font-weight: 600; color: var(--gray-900)
                Subject: font-size: 13px; color: var(--gray-500); margin-top: 2px

            Right:
                Time-ago: font-size: 12px; color: var(--gray-400); white-space: nowrap
                (format: "just now", "2h ago", "1d ago")

        Footer: "View all →" link — color: var(--indigo-600); font-size: 13px; font-weight: 600; margin-top: 16px; display: block; text-align: right

MOST ENGAGED CONTACTS (margin-top: 20px):
    background: white; border-radius: 16px; padding: 24px
    box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)

    Header: "Most Engaged Contacts", mat-icon "star" in amber, font-size: 16px; font-weight: 600

    Table (no mat-table — use a plain styled HTML table):
        columns: Rank | Contact | Company | Interactions | Last Contact | Profile link
        Header: font-size: 11px; uppercase; letter-spacing: 0.7px; color: var(--gray-400)
        Row hover: background: var(--indigo-50); transition: 0.12s
        Rank: bold number in indigo circle (24px, var(--indigo-600))
        Contact: avatar + name + email (same avatar style as contacts page)
        Interactions: bold count with small bar (CSS width bar in indigo, max-width 80px)
        "View all" link top-right: same style as Recent Activity footer link
        Redesign the Global Interactions page.

PAGE HEADER: same pattern as Contacts page
    Title: "Interactions" in DM Serif Display 32px
    Subtitle: "All communications across your contacts"
    Right button: "+ Log Interaction" (same indigo button style)

FILTER BAR (card):
    Same card style as contacts filter bar
    Two selects side by side (then spacer, then search):
        Type select (All Types / Call / Email / Meeting / Note) — width: 160px
        Period select (Last 7 days / Last 30 days / Last 90 days / All time) — width: 180px
        Search input (flex: 1) — "Search by subject or contact..."
    All inputs: same height (42px), same border/radius style as contacts

INTERACTION ITEMS LIST (card, margin-top: 16px):
    background: white; border-radius: 16px
    box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)
    overflow: hidden

    Each interaction item:
        padding: 20px 24px
        border-bottom: 1px solid var(--gray-100); last: no border
        display: flex; gap: 16px; align-items: flex-start
        transition: background 0.12s
        hover: background: var(--indigo-50)

        LEFT: type icon (same 44px colored circles from dashboard)

        MIDDLE (flex: 1):
            Row 1: subject line (font-size: 15px; font-weight: 600; color: var(--gray-900))
                   + type badge inline (same badge style, smaller: font-size: 10px, padding: 3px 8px)
            Row 2: contact name as clickable link → var(--indigo-600); font-weight: 500; font-size: 13px
                   + " · " + relative time (font-size: 13px; color: var(--gray-400))
                   + duration if present (" · 45 mins")
            Row 3 (if outcome): "OUTCOME:" in 10px uppercase var(--gray-400) letter-spacing 0.7px
                   + outcome text in a small bordered tag:
                   border: 1px solid var(--gray-200); border-radius: 6px; padding: 3px 10px;
                   font-size: 12px; font-weight: 500; color: var(--gray-600); background: var(--gray-50)

        RIGHT: vertical flex column, align-items: flex-end
            Edit icon button (pencil, same style as contacts)
            Delete icon button (trash, same style as contacts)

    DATE SECTION HEADERS between items (group by date):
        font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px
        color: var(--gray-400); padding: 14px 24px 6px
        background: var(--gray-50)
        border-bottom: 1px solid var(--gray-100)
        e.g. "TODAY", "YESTERDAY", "MARCH 20"

EMPTY STATE:
    Same pattern as contacts empty state
    Icon: mat-icon "forum" large
    "No interactions yet"
    "Start logging calls, emails, and meetings"
    Redesign the Login page with a premium split-layout design.

OVERALL LAYOUT:
    Full viewport height, CSS grid with 2 columns: 45% left panel + 55% right form panel
    On mobile (<768px): hide left panel, full width form

LEFT DECORATIVE PANEL:
    background: linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)
    padding: 60px 48px
    display: flex; flex-direction: column; justify-content: space-between

    TOP: CRM Hub logo (same icon + text as sidebar but white, larger: icon 52px, text 22px)

    MIDDLE:
        Large quote / tagline area:
            Decorative open-quote: font-size: 80px; color: rgba(255,255,255,0.12); line-height: 1; font-family: 'DM Serif Display'
        Tagline: "Every relationship, perfectly tracked."
            font-family: 'DM Serif Display'; font-size: 34px; font-weight: 400; color: white; line-height: 1.3
        Sub: "Turn contacts into long-term partnerships with CRM Hub."
            font-size: 15px; color: rgba(255,255,255,0.55); margin-top: 16px; line-height: 1.7

        Three feature bullets below (margin-top: 40px):
            Each: flex row, gap: 14px
            Icon: 36px circle, background: rgba(255,255,255,0.12), centered mat-icon in white at 18px
            Text: 14px, rgba(255,255,255,0.7), font-weight: 500
            Items: "Contact & interaction tracking" / "Real-time dashboard insights" / "Team-ready from day one"
            gap: 16px between bullets

    BOTTOM: "© 2025 CRM Hub. Built for teams." — font-size: 12px; color: rgba(255,255,255,0.3)

RIGHT FORM PANEL:
    background: var(--bg) (#F0F2F8)
    display: flex; align-items: center; justify-content: center
    padding: 48px 40px

    FORM CARD:
        background: white
        border-radius: 20px
        padding: 40px 40px
        width: 100%; max-width: 400px
        box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)

        TOP:
            "Welcome back" — font-family: 'DM Serif Display'; font-size: 28px; color: var(--gray-900)
            "Sign in to your workspace" — font-size: 14px; color: var(--gray-500); margin-top: 4px

        FORM (margin-top: 32px):
            Each field group:
                Label above input: font-size: 13px; font-weight: 600; color: var(--gray-700); margin-bottom: 6px
                Input:
                    width: 100%; height: 46px; border-radius: 10px
                    border: 1.5px solid var(--gray-200)
                    padding: 0 14px 0 44px (for icon)
                    font-size: 14px; color: var(--gray-800); background: var(--gray-50)
                    transition: all 0.15s
                    Focus: border-color: var(--indigo-500), background: white,
                           box-shadow: 0 0 0 3px rgba(99,102,241,0.15)
                Prefix icon: absolute, left: 14px, size: 18px, color: var(--gray-400)
                    Email field: mat-icon "mail_outline"
                    Password field: mat-icon "lock_outline"
                Suffix for password: eye toggle button (mat-icon-button), right: 10px,
                    toggles type between "password" and "text"

            gap: 20px between field groups

        SIGN IN BUTTON (margin-top: 28px):
            width: 100%; height: 48px
            background: var(--indigo-600)
            color: white; font-size: 15px; font-weight: 700; letter-spacing: 0.2px
            border: none; border-radius: 12px; cursor: pointer
            box-shadow: 0 4px 16px rgba(79,70,229,0.4)
            transition: all 0.18s
            Hover: background: var(--indigo-700), box-shadow: 0 6px 20px rgba(79,70,229,0.5), transform: translateY(-1px)
            Active: transform: translateY(0), box-shadow: 0 2px 8px rgba(79,70,229,0.4)
            Loading state: show mat-spinner (white, 20px) in button, text "Signing in..."

        DEMO CREDENTIALS (margin-top: 24px):
            Thin divider with "OR" centered
            Credential box:
                background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: 10px; padding: 14px 16px
                Label: "DEMO CREDENTIALS" — 10px, uppercase, var(--gray-400), letter-spacing: 0.8px
                Credentials: "admin@crm.com / admin123" — 13px, var(--gray-600), font-weight: 500; margin-top: 6px
                Small "Use these" link on right that auto-fills the form fields: color: var(--indigo-600); font-size: 12px; font-weight: 600

ENTER KEY submits the form. Show error snackbar/inline if credentials wrong (shake animation on form card).
Design the Contact Detail page (/contacts/:id) and shared modal dialogs.

CONTACT DETAIL HEADER CARD:
    background: white; border-radius: 16px; padding: 32px
    box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)

    Layout: flex row, gap: 24px

    Avatar: 72px circle, same initials color system but 72px; font-size: 26px; font-weight: 700

    Info block:
        Name: font-family: 'DM Serif Display'; font-size: 28px; color: var(--gray-900)
        Role @ Company: font-size: 15px; color: var(--gray-500); margin-top: 4px
        Status badge: same badge style, margin-top: 10px
        Tags row: email chip (mat-icon "mail" + text), phone chip, gray pill style

    Right: Edit and Delete button, same icon button style

STAT ROW below header (margin-top: 16px):
    3 small metric cards in a row (inline, not full cards — just bordered pills):
    "Total Interactions" | "Last Contact" | "Member Since"
    Each: background: white; border-radius: 12px; padding: 16px 20px; flex: 1
    Value in DM Serif Display 24px, label in 11px uppercase gray

INTERACTION TIMELINE (margin-top: 24px):
    Header row: "Interaction History" (font-weight: 600; 16px) + "+ Log Interaction" button (indigo, smaller: padding 8px 16px)

    Timeline: vertical left-aligned with connector line
        Connector line: 2px solid var(--gray-100), position: absolute, left: 19px, top: 20px, height: calc(100% - 20px)

    Each timeline item: flex row, gap: 16px, padding: 0 0 24px, position: relative

        LEFT: 40px circle icon (same colors by type), z-index: 1 (sits over connector line)

        RIGHT: card
            background: white; border-radius: 12px; padding: 16px 20px
            border: 1px solid var(--gray-100)
            flex: 1
            hover: border-color: var(--indigo-200); box-shadow: 0 2px 8px rgba(99,102,241,0.08)
            transition: all 0.15s

            Row 1: subject (font-weight: 600; 14px; var(--gray-900)) + date (12px; var(--gray-400); margin-left: auto)
            Row 2: type badge + duration (if any)
            Row 3 (if description): description text, 13px; var(--gray-600); margin-top: 8px; line-height: 1.6
            Row 4 (if outcome): "Outcome: " label + value, same outcome style as interactions page

ADD/EDIT INTERACTION DIALOG:
    mat-dialog, width: 520px
    Header: "Log Interaction" / "Edit Interaction" — font-size: 20px; font-weight: 700; color: var(--gray-900)
    Close X button top-right

    Form fields in 2-column grid where appropriate:
        Type (mat-select, full width): options with icons in dropdown
            Call (phone icon), Email (email icon), Meeting (groups icon), Note (note icon)
        Subject (text input, full width)
        Contact (mat-select or auto-complete, full width — if from /interactions page; hidden if from contact detail)
        Date + Time (mat-datepicker + time input, 2 columns)
        Duration (number input + "minutes" label, half width)
        Outcome (text input, half width)
        Description (textarea, full width, min-height: 100px, resize: vertical)

    Footer: Cancel (ghost button) + Save (indigo button)
    All inputs same style as login page inputs

ADD/EDIT CONTACT DIALOG:
    mat-dialog, width: 560px
    Same header/footer pattern

    Form: 2-column grid
        Name (full width), Email (full width), Phone + Company (2 cols), Role + Status (2 cols), Notes (full width textarea)

    Status select options with colored indicators (dot + label):
        Active (green dot), Lead (blue dot), Customer (purple dot), Inactive (gray dot)