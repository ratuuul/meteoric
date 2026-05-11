**RUET · ETE Batch 2024**

**Department Directory**

Product Requirements Document

*Version 2.0 · Static Site Expansion for Codex*

**Full-Feature Specification · Static Architecture · No Backend
Required**

  ----------------- ----------------- ----------------- -----------------
  **Field**         **Detail**        **Field**         **Detail**

  **Document**      ETE Dept.         **Status**        DRAFT --- For
                    Directory PRD                       Review
                    v2.0                                

  **Author**        Product Team      **Date**          May 2026

  **Version**       2.0               **Target**        Codex / Static
                                                        Site
  ----------------- ----------------- ----------------- -----------------

**1. Executive Summary**

The ETE Batch 2024 Department Directory is a fully static web
application serving as the definitive student-facing resource for the
Electronics & Telecommunication Engineering department at Rajshahi
University of Engineering & Technology (RUET). Version 1.0 delivered a
functional directory with search, blood group finder, and hometown
filters. This PRD defines Version 2.0 --- a comprehensive expansion
targeting Codex-assisted development, with no backend, no database, and
no server-side rendering.

All features described herein are achievable using vanilla HTML, CSS,
and JavaScript, with optional lightweight libraries (Fuse.js, Chart.js)
loaded via CDN. The entire application ships as a single HTML file
deployable to GitHub Pages, Netlify, or any static host.

> *ℹ Design north star: A student who opens this site should feel like
> they\'re using a product-grade application --- not a class project.*

**1.1 Goals**

-   Create the single source of truth for ETE \'24 student information

-   Deliver 10+ high-impact features with zero backend infrastructure

-   Enable Codex to generate, maintain, and extend the codebase
    autonomously

-   Make the site so useful that students check it daily

-   Establish a codebase that gracefully evolves toward a future dynamic
    version

**1.2 Non-Goals (v2.0)**

-   User login / authentication (deferred to v3.0)

-   Admin dashboard for live data editing (deferred to v3.0)

-   Server-side API or database (intentionally out of scope)

-   Student-submitted profile updates (static data only)

**1.3 Success Metrics**

-   Page load under 1.5s on a 4G connection

-   100% features functional with JavaScript disabled fallback text

-   All 55 student records display correctly on mobile and desktop

-   Search returns results within 50ms of keystroke

-   Zero external API calls --- fully offline-capable after first load

**2. Users & Personas**

**2.1 Primary Users**

The site serves three distinct user types within the same static
interface:

**Persona A --- The Curious Classmate**

-   Wants to find a batchmate\'s contact quickly during an emergency

-   Needs blood donor info on short notice

-   Browses profiles to learn nicknames and hometowns of new classmates

**Persona B --- The Department Admin (Read-Only)**

-   Faculty or CR who needs a class roster at a glance

-   Wants to export data as CSV for attendance or communication

-   Uses batch stats to understand class composition

**Persona C --- The Mobile-First Student**

-   Always on a phone, never on a desktop

-   Expects tap-to-call and tap-to-email functionality

-   Needs a fast, snappy experience on a low-bandwidth campus network

**3. Data Schema**

All student data is embedded as a JavaScript array constant in the HTML
file. This is the canonical data model for v2.0. Future migration to a
JSON file or API is straightforward.

**3.1 Student Object Schema**

  ----------------- ------------- --------------------------- ----------------------
  **Field**         **Type**      **Example**                 **Notes**

  **id**            string        \"2404001\"                 Roll number, unique
                                                              primary key

  **name**          string        \"Md. Fahim Moontasir\"     Full official name

  **nickname**      string        \"Fahim\"                   Known nickname /
                                                              preferred name

  **roll**          string        \"2404001\"                 Department roll, same
                                                              as id

  **mobile**        string        \"01792288648\"             BD mobile number, 11
                                                              digits

  **email**         string        \"name@gmail.com\"          May be empty string if
                                                              not provided

  **hometown**      string        \"Saidpur, Nilphamari\"     City/district; may be
                                                              empty

  **blood**         string        \"AB+\"                     One of: A+, B+, O+,
                                                              AB+, A-, B-, O-, AB-

  **section**       string        \"A\"                       Section label (to be
                                                              added in v2.0)

  **socialLinks**   object        {fb:\"\...\",li:\"\...\"}   Optional; all keys
                                                              optional

  **skills**        string\[\]    \[\"Python\",\"PCB\"\]      Self-reported; empty
                                                              array if none

  **bio**           string        \"Short bio\...\"           Optional 1--2 sentence
                                                              self-description

  **avatarColor**   string        \"#2d6a4f\"                 Auto-generated;
                                                              persisted for
                                                              consistency
  ----------------- ------------- --------------------------- ----------------------

> *ℹ Fields marked \"to be added in v2.0\" will be added manually or via
> a data-collection form. Codex should treat missing fields gracefully
> --- always check before rendering.*

**4. Feature Specifications**

Features are prioritized using the MoSCoW method adapted to static-site
constraints. P0 = must ship in v2.0, P1 = should ship, P2 = nice to
have, P3 = future version.

  ----------------------- ------------------------- -------------- ------------
  **Feature**             **Description**           **Priority**   **Effort**

  **Live Fuzzy Search**   Instant search across     **P0**         XS
                          name, nickname, roll,                    
                          hometown, email using                    
                          Fuse.js                                  

  **Blood Group           Sectioned view by blood   **P0**         XS
  Directory**             type with donor count and                
                          clickable names                          

  **Hometown Filter Map** Clickable city pills that **P0**         XS
                          filter the grid;                         
                          auto-generated from data                 

  **Grid / List / Table   Three layout modes        **P0**         S
  View**                  toggled from toolbar;                    
                          preference saved to                      
                          localStorage                             

  **Student Modal /       Full profile overlay on   **P0**         XS
  Drawer**                card click with all                      
                          available fields                         

  **Copy-to-Clipboard**   One-click copy for phone  **P0**         XS
                          and email with visual                    
                          feedback                                 

  **CSV Export**          Export filtered or all    **P0**         S
                          students as .csv download                

  **Dark Mode**           System-preference auto +  **P1**         S
                          manual toggle; persisted                 
                          to localStorage                          

  **Stats Dashboard**     Real-time batch           **P1**         M
                          analytics: blood                         
                          distribution, hometown                   
                          map, section split                       

  **Section Filter**      Filter grid by section    **P1**         XS
                          A/B when section data is                 
                          available                                

  **Shareable Deep        URL hash routing:         **P1**         S
  Links**                 #2404001 opens that                      
                          student\'s profile                       
                          directly                                 

  **Keyboard Navigation** Full keyboard support: /  **P1**         S
                          to focus search, Esc to                  
                          close modal, arrows to                   
                          navigate cards                           

  **Alphabet Index Bar**  Sticky A--Z sidebar;      **P1**         M
                          click to scroll to that                  
                          letter group                             

  **Sort Controls**       Sort by: Roll (default),  **P1**         XS
                          Name A--Z, Hometown A--Z,                
                          Blood type                               

  **Print Stylesheet**    Clean printable roster:   **P1**         S
                          3-column, no nav/search,                 
                          page breaks between                      
                          sections                                 

  **Tap-to-Call / Email** tel: and mailto: links on **P1**         XS
                          mobile for instant                       
                          dialing                                  

  **Skill Tag Cloud**     Aggregate skills from all **P2**         M
                          students into a                          
                          frequency-weighted tag                   
                          cloud                                    

  **Chart: Blood Pie**    Doughnut chart of blood   **P2**         S
                          type distribution using                  
                          Chart.js (CDN)                           

  **Chart: Hometown Bar** Horizontal bar chart of   **P2**         S
                          top 10 hometowns by                      
                          student count                            

  **Offline PWA Mode**    Service worker + manifest **P2**         L
                          for installable offline                  
                          app                                      

  **Student Timeline**    Visual timeline showing   **P2**         M
                          batch progression through                
                          years                                    

  **Confetti on Blood     Playful confetti burst    **P2**         XS
  Match**                 when you find a matching                 
                          blood donor                              

  **Emergency Card PDF**  One-click printable       **P3**         L
                          \"Emergency Contact                      
                          Card\" for any student                   

  **Admin JSON Editor**   Password-gated            **P3**         XL
                          (client-side) JSON editor                
                          to update student data                   

  **Student Profile       Individual                **P3**         XL
  Pages**                 /student-{roll}.html                     
                          pages with full profile                  

  **QR Code Generator**   Per-student QR linking to **P3**         M
                          their profile or vCard                   
                          contact export                           
  ----------------------- ------------------------- -------------- ------------

> *ℹ Effort: XS = \<2h, S = 2--4h, M = 4--8h, L = 8--16h, XL = 16h+.
> Estimates assume a developer using Codex for implementation.*

**5. Detailed Feature Specifications**

**5.1 Fuzzy Search (P0)**

Search is the most-used feature and must feel instantaneous.

**Behavior**

-   Input is debounced at 100ms

-   Fuse.js configured with threshold 0.35 for fuzzy tolerance

-   Search fields: name (weight 0.4), nickname (0.3), roll (0.2),
    hometown (0.1)

-   Results update live; no submit button required

-   Empty state shown when no results match

-   Search query preserved in URL as ?q= parameter for shareability

**Keyboard Shortcut**

-   Pressing \"/\" anywhere focuses the search input

-   Escape clears the search and returns full list

**Edge Cases**

-   Searching \"ratul\" matches both \"Ratul\" (nickname) and
    \"Mushfiqur Rahman Ratul\" (full name)

-   Searching \"2404\" returns all students (roll prefix)

-   Search is case-insensitive and diacritic-normalized

**5.2 Dark Mode (P1)**

**Implementation**

-   CSS custom properties define the full color system --- one variable
    swap flips the theme

-   On load: check localStorage(\"theme\"), then check
    prefers-color-scheme media query

-   Toggle button in nav with animated sun/moon SVG icon

-   Smooth 200ms transition on all color properties

**Dark Palette (additions to existing token system)**

-   \--bg-primary: #1A1918 (warm dark canvas)

-   \--bg-secondary: #222120 (card surfaces)

-   \--text-primary: rgba(255,255,255,0.92)

-   \--text-secondary: #A39E98

-   \--border: rgba(255,255,255,0.1)

**5.3 Stats Dashboard (P1)**

A collapsible panel above the student grid showing real-time aggregated
analytics computed from the student data array.

**Panels**

-   Class composition: pie chart (Chart.js) of blood types

-   Geographic spread: horizontal bar chart of top 10 hometowns

-   Data completeness: progress bars showing % of students with email,
    mobile, hometown filled

-   Quick facts: total students, unique hometowns, unique blood types,
    sections

**Interaction**

-   Clicking a bar in the hometown chart applies the hometown filter to
    the grid

-   Clicking a blood type slice applies the blood filter

-   Dashboard collapses/expands with smooth CSS height animation

**5.4 Shareable Deep Links (P1)**

**URL Scheme**

-   Base: index.html --- full directory, no filter

-   Search: index.html?q=ratul --- pre-filled search on load

-   Blood filter: index.html?blood=A%2B --- pre-applied blood filter

-   Hometown filter: index.html?hometown=Pabna --- pre-applied location
    filter

-   Profile: index.html#2404004 --- opens that student\'s modal on load

**Implementation Notes**

-   On DOMContentLoaded: parse URL params, apply filters, then check
    hash for modal

-   Update URL silently (history.replaceState) when filters change

-   Copying a filtered URL shares the exact filtered state

**5.5 Keyboard Navigation (P1)**

-   \"/\": focus search input

-   Esc: close modal or clear search

-   Arrow keys: navigate between student cards when grid is focused

-   Enter: open modal for focused card

-   \"d\": toggle dark mode

-   \"e\": export CSV

-   Tab: standard tab order through all interactive elements

-   Focus ring: visible 2px solid blue ring on all interactive elements

**5.6 Alphabet Index Bar (P1)**

A sticky vertical sidebar (desktop) or horizontal scroll bar (mobile)
showing A--Z. Only letters present in the current filtered set are
active.

-   Clicking a letter smooth-scrolls to the first card starting with
    that letter

-   Current letter highlights as user scrolls (IntersectionObserver)

-   Inactive letters (no match in current filter) are dimmed and
    non-clickable

-   On mobile, the bar appears as a horizontal pill row below the
    toolbar

**5.7 Print Stylesheet (P1)**

**Print Layout**

-   3-column grid of compact student cards

-   Each card: initials avatar, name, roll, blood type, mobile

-   Page header: \"ETE Batch 2024 · Department Directory · Printed on
    {date}\"

-   Page footer: page numbers

-   No navigation, search, filters, or action buttons

-   Blood type color-coded consistently with screen version

-   Force page breaks between blood group sections

> *ℹ Triggered via window.print() from a \"Print Roster\" button in the
> nav. CSS \@media print handles the layout shift automatically.*

**5.8 PWA Offline Mode (P2)**

-   web manifest.json: name, short_name, icons (192px, 512px),
    theme_color

-   Service worker: cache-first strategy for all static assets

-   Install prompt: custom \"Add to Home Screen\" banner on mobile
    browsers

-   Offline fallback: the full app works offline since all data is
    embedded

-   Update flow: service worker checks for updates on each visit, shows
    \"refresh\" toast if new version detected

**6. UX & Design System**

**6.1 Typography**

-   Display / Hero: DM Serif Display --- warm, editorial, distinctive

-   Body / UI: Instrument Sans --- clean, readable, professional

-   Monospace (roll numbers, data): system-ui monospace stack

-   All fonts loaded via Google Fonts with display=swap for performance

**6.2 Color System**

-   Primary background: #FFFFFF (light) / #1A1918 (dark)

-   Secondary background: #F6F5F4 (light) / #222120 (dark)

-   Text primary: rgba(0,0,0,0.95) (light) / rgba(255,255,255,0.92)
    (dark)

-   Accent blue: #0075DE --- CTAs, links, active states

-   Border: 1px solid rgba(0,0,0,0.1) --- whisper-weight throughout

-   Shadow: 4-layer stack, max 0.04 opacity --- depth without weight

**6.3 Avatar System**

Each student gets a deterministic avatar color derived from their name
using a hash function. This ensures the same student always gets the
same color across sessions without any stored state. Initials are shown
over the colored background.

-   Hash: simple string hash mod 15-color palette

-   Palette: 15 warm, saturated colors --- no pastels, no grays

-   In v3.0: replaced by actual uploaded photo

**6.4 Animation Principles**

-   Card entrance: fadeUp (opacity 0→1, translateY 8px→0) staggered by
    30ms per card, capped at 300ms

-   Modal: scale 0.96→1 with opacity in 200ms ease

-   Theme switch: 200ms transition on all color properties

-   Filter transitions: grid opacity 0.3→1 on filter change

-   No infinite animations except the hero badge pulse (2s, subtle)

**6.5 Responsive Breakpoints**

-   Mobile (\< 480px): 1-column grid, search full-width, no view toggle

-   Tablet (480--768px): 2-column grid, condensed toolbar

-   Desktop (768--1200px): 3--4 column grid, full toolbar, alphabet
    sidebar

-   \>1200px: 4--5 column grid, max-width 1280px centered

**7. Component Inventory**

**7.1 Navigation Bar**

-   Logo mark (ETE monogram) + department name

-   Student count badge (live, updates with filters)

-   Dark mode toggle (sun/moon SVG)

-   Print roster button

-   Export CSV button (primary blue CTA)

**7.2 Hero Section**

-   Animated badge with pulsing dot: \"Batch 2024 · ETE · RUET\"

-   Display headline in DM Serif Display with italic accent word in blue

-   Subtitle in muted gray

-   Radial gradient glow behind hero (CSS, no image)

**7.3 Stats Bar**

-   Four metric cards: Total Students, Hometowns, Blood Types, Emails
    Listed

-   Metric in large DM Serif Display; label in small all-caps

-   Horizontal scroll on mobile, centered on desktop

**7.4 Toolbar**

-   Search input with magnifier icon and \"/\" shortcut hint

-   Blood type filter pills (All, A+, B+, O+, AB+, ...)

-   Sort dropdown (Roll, Name, Hometown, Blood)

-   Section filter (All, Section A, Section B) --- visible when data
    available

-   View mode toggle (Grid / List / Table)

**7.5 Student Card (Grid Mode)**

-   Roll number badge (top-right, pill)

-   Colored avatar with initials (44×44px, 10px radius)

-   Full name (bold, 15px) + nickname in muted caption

-   Hometown, mobile, email rows with icon prefix

-   Blood type badge (color-coded by group)

-   Hover-reveal action row: \"Copy number\" / \"Copy email\"

-   Click anywhere → opens Student Modal

**7.6 Student Card (List Mode)**

-   Single-row layout: avatar + name + roll + blood + hometown

-   More information density, faster scanning

-   Click anywhere → opens Student Modal

**7.7 Student Card (Table Mode)**

-   Full-width table with sortable columns

-   Columns: Avatar, Name, Roll, Nickname, Blood, Hometown, Mobile,
    Email

-   Row hover highlight

-   Click row → opens Student Modal

**7.8 Student Modal**

-   Large avatar (64×64) with name in DM Serif Display

-   All available fields in labeled rows

-   Blood type badge with group-specific color

-   Action buttons: Copy Number, Copy Email

-   Social links (if available): Facebook, LinkedIn

-   Close: × button, Escape key, or backdrop click

-   URL hash updates to #roll on open

**7.9 Blood Group Directory Section**

-   Four cards: A+, B+, O+, AB+ (and negatives if present)

-   Each card: blood type in large serif, member count badge, name pills

-   Clicking a name pill opens that student\'s modal

-   Color-coding consistent with cards and modal

**7.10 Hometown Grid Section**

-   Auto-generated from student data --- no manual maintenance

-   Sorted by frequency (most students first)

-   Each city shows name + student count badge

-   Click → applies hometown filter to student grid above

-   Active city highlighted when filter is applied

**7.11 Toast Notifications**

-   Appears from bottom-center, auto-dismisses after 2.5s

-   Used for: copy confirmations, export success, filter applied

-   Dark background (warm dark), rounded pill shape

-   Never stacks --- replaces previous toast

**8. Accessibility Requirements**

The site must meet WCAG 2.1 AA. Codex should validate these requirements
during implementation.

**8.1 Standards**

-   All interactive elements have visible focus indicators

-   Color is never the only means of conveying information (blood type
    also has text label)

-   Images (avatars) have appropriate alt text

-   All modals trap focus and return focus on close

-   Contrast ratio: primary text on background ≥ 7:1 (AAA)

-   Contrast ratio: secondary text on background ≥ 4.5:1 (AA)

**8.2 Screen Reader Support**

-   Student cards use role=\"article\" with aria-label including name
    and roll

-   Modal uses role=\"dialog\", aria-modal=\"true\", aria-labelledby
    pointing to name heading

-   Filter buttons use aria-pressed for toggle state

-   Search input has aria-label and aria-live region for result count

-   Toast notifications use role=\"status\" for announcements

**9. Performance Requirements**

**9.1 Targets**

-   First Contentful Paint: \< 1.0s on 4G

-   Time to Interactive: \< 1.5s on 4G

-   Largest Contentful Paint: \< 2.0s on 4G

-   Total page weight: \< 150KB (excluding CDN fonts and Chart.js)

-   Search response: \< 50ms per keystroke

-   Filter/sort response: \< 16ms (one frame)

**9.2 Implementation Notes**

-   Student data is a JS array literal --- no JSON.parse overhead

-   Avatar colors computed once on page load and cached in a Map

-   DOM operations batched via DocumentFragment for initial render

-   IntersectionObserver used for alphabet bar highlighting (not scroll
    events)

-   Images (none in v2.0): will use loading=\"lazy\" when student photos
    are added in v3.0

-   Fuse.js: load conditionally after first search keystroke if not
    already loaded

**10. Codex Implementation Guide**

This section provides Codex with specific implementation patterns, file
structure, and code conventions to follow when building v2.0.

**10.1 File Structure**

-   index.html --- Single file containing all HTML, CSS (in \<style\>),
    JS (in \<script\>)

-   README.md --- Setup instructions and feature list

-   Optional: /assets/manifest.json --- PWA manifest (P2 feature)

-   Optional: /assets/sw.js --- Service worker (P2 feature)

> *ℹ The single-file architecture is intentional. It enables zero-config
> deployment and simplifies Codex\'s ability to read and modify the full
> codebase in one context.*

**10.2 JavaScript Architecture**

-   No build step. No modules. No framework. Vanilla ES6+.

-   All state in a single STATE object: { search, blood, hometown,
    section, sort, view, theme }

-   One render() function that reads STATE and reconstructs the DOM

-   All event handlers call setState(patch) which merges, updates URL,
    and calls render()

-   STUDENTS array is const --- never mutated; filtering creates new
    arrays

-   Helper functions are pure: getInitials(name), getAvatarColor(name),
    normalizeHometown(str), bloodClass(blood)

**10.3 CSS Architecture**

-   CSS custom properties define the entire token system (colors,
    shadows, radii)

-   \[data-theme=\"dark\"\] selector on :root overrides all color tokens

-   BEM-lite naming: .card, .card\_\_header, .card\_\_avatar,
    .card\--list

-   \@media print block at the end handles all print styles

-   Animations use \@keyframes defined once, referenced by multiple
    classes

**10.4 Codex Prompt Patterns**

When prompting Codex to add features, use this format for best results:

-   Describe the feature in terms of STATE changes: \"Add a sort field
    to STATE; render() should sort filtered before rendering\"

-   Reference component names from Section 7 of this PRD

-   Always specify accessibility requirements inline: \"Add aria-pressed
    to filter buttons\"

-   For UI: reference the design tokens by name rather than hex values:
    \"Use \--accent-blue for the CTA\"

-   Test edge cases: \"Handle students where blood is empty string\"

**11. Future Roadmap (v3.0 Preview)**

These features are explicitly out of scope for v2.0 but should inform
architectural decisions. Codex should avoid implementation choices that
would make these difficult to add.

**11.1 v3.0 Feature Candidates**

-   Student login with RUET email (Google OAuth or magic link)

-   Self-service profile editing (name, bio, skills, social links,
    photo)

-   Admin dashboard: CSV re-upload, student add/remove, approval queue

-   Photo uploads: Cloudinary or Supabase Storage

-   Real-time presence: \"X students online now\" (Supabase Realtime)

-   Messaging: basic student-to-student direct message

-   Event board: class notices, exam schedules, shared announcements

-   Individual student profile pages with custom URL slugs

**11.2 Architectural Hints**

-   The STATE object maps directly to URL params --- easy to move to
    route-based navigation

-   The STUDENTS array maps directly to a database table schema

-   The render() function maps directly to a React component tree

-   All feature flags (section filter visibility, skills section) should
    be driven by data presence, not hardcoded

**12. Milestones & Timeline**

  ------------- --------------------- ------------------ -----------------
  **Phase**     **Deliverables**      **Owner**          **Timeline**

  **M0 · Prep** Data cleanup, schema  Data Owner / CR    **Week 1**
                validation, all 55                       
                records verified and                     
                normalized                               

  **M1 · Core** P0 features: search,  Codex + Dev        **Week 1--2**
                blood finder,                            
                hometown filter,                         
                modal, copy, CSV                         
                export                                   

  **M2 ·        P1 features: dark     Codex + Dev        **Week 2--3**
  Polish**      mode, stats                              
                dashboard, deep                          
                links, keyboard nav,                     
                alphabet bar                             

  **M3 ·        P2 features: charts,  Codex + Dev        **Week 3--4**
  Extras**      skill cloud, PWA                         
                manifest, print                          
                stylesheet                               

  **M4 · QA**   Cross-browser testing Full Team          **Week 4**
                (Chrome, Firefox,                        
                Safari, mobile),                         
                accessibility audit                      

  **M5 ·        GitHub Pages deploy,  Dev Lead           **Week 4--5**
  Deploy**      README, share link to                    
                all ETE \'24 students                    
  ------------- --------------------- ------------------ -----------------

**13. Risks & Mitigations**

**13.1 Data Quality**

-   Risk: Some student records have empty fields (email, hometown, blood
    type)

-   Mitigation: All render functions check for empty values before
    displaying; \"N/A\" shown where required

-   Mitigation: A data-completeness panel in the Stats Dashboard shows
    which fields need filling

**13.2 Privacy**

-   Risk: Phone numbers and email addresses are publicly visible in the
    HTML source

-   Mitigation: This is an internal departmental directory --- not
    indexed by search engines (robots.txt: Disallow: /)

-   Mitigation: In v3.0, sensitive fields are hidden behind login

> *⚠ The site must NOT be shared as a public URL on social media. It is
> intended for ETE \'24 batch members only.*

**13.3 Browser Compatibility**

-   Risk: CSS custom properties and IntersectionObserver not supported
    in very old browsers

-   Mitigation: Target Chrome 80+, Firefox 75+, Safari 13+. This covers
    99%+ of RUET student devices

-   Mitigation: navigator.clipboard has a fallback using
    document.execCommand for older mobile browsers

**13.4 Scope Creep**

-   Risk: Stakeholders request dynamic features (user login, data
    editing) for v2.0

-   Mitigation: Reference Section 1.2 (Non-Goals) and Section 11 (v3.0
    Roadmap) to defer appropriately

**14. Appendix**

**14.1 Fuse.js Configuration**

-   keys:
    \[{name:\"name\",weight:0.4},{name:\"nickname\",weight:0.3},{name:\"roll\",weight:0.2},{name:\"hometown\",weight:0.1}\]

-   threshold: 0.35 (lower = stricter match)

-   ignoreLocation: true (match anywhere in string, not just start)

-   minMatchCharLength: 2

**14.2 Avatar Color Palette**

-   #2d6a4f --- Forest green

-   #1d3461 --- Midnight blue

-   #7b2d8b --- Deep violet

-   #c05a00 --- Burnt orange

-   #0d4f8b --- Ocean blue

-   #5c3317 --- Mahogany

-   #2a6b7c --- Teal

-   #6b2d3e --- Crimson

-   #3d5a00 --- Olive

-   #7a3e20 --- Sienna

-   #8b4513 --- Saddle brown

-   #2e4057 --- Denim

-   #5b4fcf --- Indigo

-   #2f7a4d --- Emerald

-   #1a4a6e --- Steel blue

**14.3 URL Parameter Reference**

-   ?q={query} --- Pre-filled search term on load

-   ?blood={type} --- Pre-applied blood filter (URL-encoded: A%2B for
    A+)

-   ?hometown={city} --- Pre-applied hometown filter

-   ?section={A\|B} --- Pre-applied section filter

-   ?sort={roll\|name\|hometown\|blood} --- Sort order

-   ?view={grid\|list\|table} --- Layout mode

-   #2404001 --- Opens modal for student with that roll on load

**14.4 Revision History**

  --------------- ------------- ------------------ ----------------------
  **Field**       **Type**      **Example**        **Notes**

  **v1.0**        Initial       May 2026           First working version
                                                   --- core directory,
                                                   search, blood finder

  **v2.0**        PRD Draft     May 2026           Full feature expansion
                                                   for Codex --- 26
                                                   features specified
  --------------- ------------- ------------------ ----------------------

*End of Document*

ETE Batch 2024 · RUET · Rajshahi, Bangladesh
