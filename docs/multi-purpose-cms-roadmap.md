# Multi-Purpose CMS Roadmap

## Objective

Transform the current jewelry MVP into a multi-purpose CMS platform with:

1. A template engine that provides different landing page bases per business type.
2. Vertical feature modules that can be enabled depending on the selected business.
3. A next vertical focused on guesthouse / room rental with a booking engine.

## Current Starting Point

The current codebase already has a useful split:

1. Generic foundation:
   - `SiteSetting` key-value settings
   - `Section` content blocks with metadata
   - `Media`
   - admin auth and feature flags
2. Jewelry-specific domain:
   - `Collection`, `Product`, `Order`, `OrderItem`
   - jewelry-focused landing page structure and copy
   - shop / checkout flow

This means the right direction is not rewriting everything. The right direction is extracting a platform layer from the current jewelry implementation.

## Product Direction

### Core Platform

The platform should answer these questions for every tenant / business setup:

1. What business type is this?
2. What landing template should be used?
3. What modules are enabled?
4. What content schema is editable for that template?

### Initial Business Types

Phase 1 business types:

1. `jewelry`
2. `guesthouse`

Later business types can follow the same contract, for example:

1. restaurant
2. salon
3. villa
4. agency
5. portfolio

## Recommended Architecture

## 1. Template Engine Layer

Introduce a template engine as configuration plus renderer, not as hardcoded page forks.

### Proposed concept

Create a template definition per business type:

1. Template identity
   - `templateKey`
   - `businessType`
   - display name
2. Template sections
   - ordered section registry
   - supported fields per section
   - default copy and imagery
3. Feature bundle
   - landing only
   - blog
   - commerce
   - booking
   - testimonials
   - contact / inquiry

### Proposed app shape

Suggested directories:

1. `app/templates/base/`
2. `app/templates/jewelry/`
3. `app/templates/guesthouse/`
4. `app/components/sections/`
5. `app/composables/useTemplate.ts`

### Template contract

Each template should expose:

1. `templateKey`
2. `businessType`
3. `themeDefaults`
4. `sectionSchema[]`
5. `enabledFeatures[]`
6. `navigationPreset`
7. `pageVariants`

This keeps rendering dynamic while still giving you design control.

## 2. CMS Domain Layer

Move from one-site assumptions toward configurable site identity.

### New entities to add

Recommended additions:

1. `Site`
   - id
   - name
   - slug
   - businessType
   - templateKey
   - status
2. `SiteFeature`
   - siteId
   - featureKey
   - enabled
3. `TemplatePreset` or static config file registry
   - templateKey
   - businessType
   - version

### Existing models to make site-aware later

Eventually these should belong to a site:

1. `SiteSetting`
2. `Section`
3. `Media`
4. `BlogPost`
5. `Collection`
6. `Product`
7. `Testimonial`
8. `Order`

If multi-tenant is not needed yet, you can still add `businessType` and `templateKey` first before full `siteId` isolation.

## 3. Feature Module Layer

Treat modules as installable business capabilities.

### Shared module types

1. `landing`
2. `blog`
3. `shop`
4. `booking`
5. `testimonials`
6. `contact`
7. `integrations`

### Jewelry bundle

1. landing
2. blog
3. shop
4. testimonials
5. contact

### Guesthouse bundle

1. landing
2. booking
3. testimonials
4. contact
5. optional blog

## Roadmap Phases

## Phase 0: Stabilize MVP Baseline

Status: done enough to branch from `v.1.0-stable`.

Goals:

1. Keep jewelry running without regression.
2. Avoid breaking `main` while refactoring on `multi-purpose-cms`.

Exit criteria:

1. Stable tag exists.
2. New development branch exists.

## Phase 1: Introduce Business Identity

Goal: make the app aware of business type and selected template.

Work items:

1. Add platform settings keys:
   - `businessType`
   - `templateKey`
   - `siteLabel`
2. Add admin UI for selecting business type and template.
3. Create a central template registry in code.
4. Refactor landing page to render through `useTemplate()` instead of jewelry assumptions.

Exit criteria:

1. The same CMS can boot as `jewelry` using the current design.
2. Template selection is driven from config, not hardcoded page logic.

## Phase 2: Extract Reusable Landing Sections

Goal: convert the jewelry landing into reusable section components.

Work items:

1. Break landing into generic components:
   - Hero
   - Feature Grid
   - Collections / Catalog Grid
   - Testimonials
   - Contact CTA
   - Blog Preview
2. Move jewelry-specific labels, nav, and visuals into template config.
3. Standardize section metadata shapes.
4. Create section render mapping based on template registry.

Exit criteria:

1. Jewelry template renders from shared building blocks.
2. Section order is template-driven.

## Phase 3: Guesthouse Template Foundation

Goal: add the second landing template without booking logic first.

Work items:

1. Add `guesthouse` template preset.
2. Define guesthouse-specific sections:
   - Hero
   - Room Types
   - Amenities
   - Gallery
   - Location
   - Testimonials
   - Booking CTA
3. Add guesthouse theme defaults.
4. Add admin content form support for these sections.

Exit criteria:

1. Admin can switch site to `guesthouse`.
2. Frontend renders a guesthouse landing page with unique layout and content schema.

## Phase 4: Booking Engine Data Model

Goal: add the backend domain for room rental and reservations.

Recommended models:

1. `Property`
   - id
   - name
   - slug
   - description
   - address
   - checkInTime
   - checkOutTime
2. `RoomType`
   - id
   - propertyId
   - name
   - slug
   - description
   - capacity
   - basePrice
   - gallery[]
   - amenities json or relation
3. `RoomUnit`
   - id
   - roomTypeId
   - code
   - status
4. `Booking`
   - id
   - guestName
   - guestEmail
   - guestPhone
   - checkInDate
   - checkOutDate
   - nights
   - adults
   - children
   - totalAmount
   - status
   - paymentStatus
5. `BookingRoom`
   - bookingId
   - roomTypeId or roomUnitId
   - nightlyRate
   - quantity
6. `SeasonalRate`
   - roomTypeId
   - startDate
   - endDate
   - price
7. `BlockedDate`
   - roomUnitId or roomTypeId
   - startDate
   - endDate
   - reason

Exit criteria:

1. Prisma supports room inventory and reservation records.
2. Availability can be calculated safely.

## Phase 5: Booking Engine Workflow

Goal: enable real booking flows.

Core flow:

1. Guest selects dates.
2. System checks availability.
3. Guest selects room type.
4. System calculates total.
5. Guest submits reservation.
6. Admin confirms or payment confirms automatically.

Work items:

1. Availability API
2. Booking quote calculation
3. Checkout / reservation form
4. Booking confirmation page
5. Admin booking dashboard
6. Status lifecycle:
   - pending
   - confirmed
   - paid
   - checked_in
   - checked_out
   - cancelled

Exit criteria:

1. Guesthouse site can accept reservations end-to-end.
2. Admin can manage bookings operationally.

## Phase 6: Admin Experience by Business Type

Goal: stop showing irrelevant CMS menus.

Work items:

1. Dynamic admin navigation per enabled module.
2. Guesthouse-specific admin pages:
   - Properties
   - Room Types
   - Inventory
   - Bookings
   - Seasonal Rates
3. Jewelry pages shown only when commerce module is active.
4. Shared settings remain global:
   - Site identity
   - Theme
   - SEO
   - Media
   - Features

Exit criteria:

1. Admin UI feels purpose-built for each business type.

## Phase 7: Multi-Site or Multi-Tenant Expansion

Goal: optional future stage after business templates are proven.

Work items:

1. Add `Site` ownership to all content.
2. Add site switcher in admin.
3. Separate media folders and content by site.
4. Add provisioning flow for new sites from a chosen template.

Exit criteria:

1. One CMS instance can manage multiple businesses safely.

## First Build Order Recommendation

Do this in order:

1. Template registry
2. Business type and template settings
3. Reusable landing section renderer
4. Jewelry template migration onto the new engine
5. Guesthouse template without booking logic
6. Booking schema and APIs
7. Booking frontend flow
8. Admin menus per business type

This order matters because the booking engine should not be built on top of jewelry-specific page assumptions.

## Suggested First 3 Technical Tickets

### Ticket 1

Create template registry and business-type settings.

Deliverables:

1. `businessType` setting
2. `templateKey` setting
3. `useTemplate()` composable
4. jewelry template config extracted from current landing

### Ticket 2

Refactor landing page renderer to use template config.

Deliverables:

1. shared section renderer
2. template-based nav
3. template-driven hero / testimonials / contact blocks

### Ticket 3

Create guesthouse template preset and content schema.

Deliverables:

1. guesthouse section list
2. guesthouse admin editable fields
3. guesthouse landing page rendering

## Key Risks

1. Mixing business logic with presentation logic again.
2. Reusing `Section.metadata` without a clear schema contract.
3. Building booking flows before inventory rules are defined.
4. Leaving admin menus static while modules become dynamic.

## Rule of Thumb

The platform should evolve like this:

1. Template decides layout and content structure.
2. Module decides business capability.
3. Business type decides default bundle of template plus modules.

That separation will keep jewelry, guesthouse, and future verticals maintainable.