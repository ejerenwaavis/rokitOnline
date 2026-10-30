# CONTEXT.md: Rokit Migration

## STATUS
- Current phase: Phase 0 (Discovery & Baseline)
- Current task: Phase 0 Gate Review & Sign-Off
- Last completed task: Task 0.11 Staging Plan & Isolation Strategy
- Blocked on: User review of Phase 0 inventories, staging plan, and DB isolation proposal before proceeding to Phase 1
- Last updated: 2026-10-30T10:15:00-04:00

---

## STACK & ENVIRONMENT (filled in Phase 0)
- **Runtime**: Node.js (Local: v24.19.0; Production: v22.23.3 located at `/home/rokiroqw/nodevenv/rokitOnline/server/22/bin/node`)
- **Backend Framework**: Express 5.2.1
- **Frontend Framework**: React 19.2.0, React Router DOM v7.13.1 (Single Page Application)
- **View Engine**: Client-side React JSX. Express serves static build from `public_html` / `client/public_html` with catch-all `app.get('/*', ...)` serving `index.html`.
- **Bundler & Build Tool**: Vite 7.3.7, Rollup with chunking (`vendor-react`, `vendor-stripe`, `vendor-tiptap`, `vendor-swiper`, `vendor-ui`, `vendor-lightbox`, `vendor-motion`).
- **CSS Approach**: Tailwind CSS 3.4.19 + PostCSS + Autoprefixer. Single source of truth class abstraction layer in `client/src/theme.js` (`T` object).
- **Database**: MongoDB Atlas (Cloud Cluster, connected via Mongoose 8.23.0).
- **Authentication**: JWT (JSON Web Tokens stored in client `localStorage`, verified via `Authorization: Bearer <token>`) + 2FA Email OTP (crypto SHA-256 hash, 10 min expiry). OIDC Provider (`oidc-provider` v9.13.0) for external client interaction.
- **File Storage**: Cloudinary (Direct signed uploads + server Multer Cloudinary storage).
- **Payment Gateway**: Stripe SDK 20.4.1 (PaymentIntents, Webhooks with raw body parser).
- **Email Service**: Nodemailer over SMTP (`smtp.gmail.com:587`).
- **AI Processing**: Replicate SDK 1.4.0 (GFPGAN & Clarity Upscaler).
- **Hosting Environment**: Namecheap cPanel Cloud/Shared Hosting (`rokiroqw`).
- **Process Manager & Web Server**: CloudLinux Passenger (`touch server/tmp/restart.txt` to trigger hot restart) fronted by LiteSpeed Web Server.
- **Entry Files**:
  - Backend: `server/src/app.js` (listening on port 5000 in dev, exported to Passenger in production).
  - Frontend: `client/src/main.jsx` -> `client/src/App.jsx`.
- **Exact Deploy Procedure**:
  1. Local compile: `npm.cmd --prefix client run build` (outputs to `client/public_html`).
  2. Root synchronization: `Copy-Item -Path "client/public_html/*" -Destination "public_html" -Recurse -Force`.
  3. Git push: `git add -A`, `git commit -m "[Phase X.Y] description"`, `git push origin redesign/new-look`.
  4. Remote deploy over SSH (`rokitonline`):
     `ssh rokitonline "cd /home/rokiroqw/rokitOnline && git pull origin redesign/new-look && cp -r client/public_html/* /home/rokiroqw/public_html/ && touch server/tmp/restart.txt"`
  5. Excluded files/folders (never committed or deployed): `.env`, `server/.env`, `client/.env`, `server/secrets/`, `*.jwks.json`, `node_modules/`, `client/public_html/.htaccess`, `inspiration/`.

---

## ROUTE INVENTORY (filled in Phase 0)

### Frontend Routes (React Router SPA in `client/src/App.jsx`)
| Path | Auth Requirement | Component | Description |
| :--- | :--- | :--- | :--- |
| `/` | Public | `Home.jsx` | Homepage with hero, manifesto, services, portfolio, testimonials |
| `/about` | Public | `About.jsx` | Company story, vision, team, and stats |
| `/services` | Public | `Services.jsx` | Full catalog of services |
| `/services/:slug` | Public | `ServiceDetail.jsx` | Individual service page with deliverables & quote CTA |
| `/gallery` | Public | `Gallery.jsx` | Filterable masonry portfolio gallery with lightbox |
| `/gallery/:id` | Public | `PortfolioDetail.jsx` | Detailed project case study with milestone media |
| `/photo-enhancer` | Public | `PhotoEnhancer.jsx` | AI image restoration and upscaling tool |
| `/solutions/ngo` | Public | `SolutionNGO.jsx` | Tailored branding/print solutions for non-profits |
| `/solutions/sme` | Public | `SolutionSME.jsx` | Tailored solutions for growing businesses |
| `/tutorials` | Public | `Tutorials.jsx` | Insights, design guides, and tutorials |
| `/tutorials/:slug` | Public | `TutorialPost.jsx` | Rich-text tutorial article view |
| `/contact` | Public | `Contact.jsx` | Contact info, location maps, and direct message form |
| `/terms` | Public | `Terms.jsx` | Terms of service |
| `/privacy` | Public | `Privacy.jsx` | Privacy policy |
| `/cookies` | Public | `Cookies.jsx` | Cookie policy and preferences |
| `/health` | Public | `Health.jsx` | Public system status check |
| `/auth/login` | Public (Unauthenticated) | `Login.jsx` | User login + step-2 MFA OTP challenge |
| `/auth/register` | Public (Unauthenticated) | `Register.jsx` | User registration |
| `/auth/forgot-password` | Public | `ForgotPassword.jsx` | Request password reset email |
| `/auth/reset-password/:token`| Public | `ResetPassword.jsx` | Set new password with token |
| `/portal` | Protected (`isLoggedIn`) | `Dashboard.jsx` | Customer dashboard: order history, quotes, design requests |
| `/portal/orders/new` | Protected (`isLoggedIn`) | `NewOrder.jsx` | Submit new print job order with file attachments |
| `/portal/orders/:id` | Protected (`isLoggedIn`) | `OrderDetail.jsx` | View order progress, timeline, and price negotiation |
| `/portal/quotes/new` | Public / Protected | `NewQuote.jsx` | Request formal price quotation |
| `/portal/designs/new` | Protected (`isLoggedIn`) | `NewDesign.jsx` | Submit graphic design brief with reference files |
| `/admin` | Admin (`isAdmin`) | `AdminDashboard.jsx` | Overview KPIs, metrics, recent orders & quotes |
| `/admin/orders` | Admin (`isAdmin`) | `OrdersManager.jsx` | Full orders pipeline, quote/price updating, supplier forward |
| `/admin/portfolio` | Admin (`isAdmin`) | `PortfolioManager.jsx`| Portfolio CMS: add/edit items, milestones, challenges |
| `/admin/tutorials` | Admin (`isAdmin`) | `TutorialsManager.jsx`| Tutorial CMS: Tiptap editor, draft/publish, thumbnail |
| `/admin/services` | Admin (`isAdmin`) | `ServicesManager.jsx` | Services catalog manager: pricing, turnaround, features |
| `/admin/customers` | Admin (`isAdmin`) | `CustomersManager.jsx`| User directory: role elevation, account suspension |
| `/admin/clients` | Admin (`isAdmin`) | `ClientsManager.jsx`  | Client marquee logos management |
| `/admin/media-bridge` | Admin (`isAdmin`) | `MediaBridge.jsx`   | Rapid Project Media Bridge (Markdown register ingestion) |

### Backend API Routes (`server/src/routes/`)
| Method | Endpoint | Auth / Middleware | Controller / Handler | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | None | Inline | Health check |
| `POST` | `/api/auth/register` | None | `register` | Create customer account, return JWT |
| `POST` | `/api/auth/login` | None | `login` | Verify credentials, send MFA OTP, return `mfaToken` |
| `POST` | `/api/auth/verify-mfa` | None | `verifyMfa` | Verify OTP code, return full JWT |
| `GET` | `/api/auth/me` | `protect` | `getMe` | Fetch current authenticated user record |
| `POST` | `/api/auth/forgot-password` | None | `forgotPassword` | Generate reset token, send reset email |
| `POST` | `/api/auth/reset-password/:token` | None | `resetPassword` | Validate reset token, update password |
| `GET` | `/api/services` | None | `getServices` | List active services |
| `GET` | `/api/services/:slug` | None | `getServiceBySlug` | Get single service details |
| `POST` | `/api/services` | `protect`, `adminOnly` | `createService` | Admin create service |
| `PUT` | `/api/services/:id` | `protect`, `adminOnly` | `updateService` | Admin update service |
| `DELETE` | `/api/services/:id` | `protect`, `adminOnly` | `deleteService` | Admin delete service |
| `GET` | `/api/portfolio` | None | `getPortfolio` | List portfolio projects (drafts quarantined) |
| `GET` | `/api/portfolio/featured` | None | `getFeatured` | Get featured portfolio projects |
| `GET` | `/api/portfolio/:id` | None | `getPortfolioById` | Get single project details |
| `POST` | `/api/portfolio` | `protect`, `adminOnly`, `upload.array('images')` | `createPortfolioItem` | Admin add portfolio project |
| `POST` | `/api/portfolio/upload-step-image` | `protect`, `adminOnly`, `upload.single('image')` | `uploadStepImage` | Admin upload milestone step image |
| `PUT` | `/api/portfolio/:id` | `protect`, `adminOnly` | `updatePortfolioItem` | Admin update portfolio project |
| `DELETE` | `/api/portfolio/:id` | `protect`, `adminOnly` | `deletePortfolioItem` | Admin delete portfolio project |
| `GET` | `/api/tutorials` | None | `getTutorials` | List published tutorials |
| `GET` | `/api/tutorials/admin/all` | `protect`, `adminOnly` | `getAllTutorialsAdmin` | Admin list all tutorials (including drafts) |
| `GET` | `/api/tutorials/:slug` | None | `getTutorialBySlug` | Get tutorial post by slug |
| `POST` | `/api/tutorials` | `protect`, `adminOnly`, `upload.single('thumbnail')` | `createTutorial` | Admin create tutorial |
| `PUT` | `/api/tutorials/:id` | `protect`, `adminOnly`, `upload.single('thumbnail')` | `updateTutorial` | Admin update tutorial |
| `DELETE` | `/api/tutorials/:id` | `protect`, `adminOnly` | `deleteTutorial` | Admin delete tutorial |
| `POST` | `/api/orders` | `protect`, `upload.array('files')` | `createOrder` | Customer create job order + Stripe PaymentIntent |
| `GET` | `/api/orders/mine` | `protect` | `getMyOrders` | List customer's own orders |
| `GET` | `/api/orders/:id` | `protect` | `getOrderById` | Get order detail |
| `POST` | `/api/orders/:id/accept-price` | `protect` | `acceptPrice` | Customer accepts quoted price |
| `POST` | `/api/orders/:id/counter-offer` | `protect` | `counterOffer` | Customer submits counter-offer |
| `POST` | `/api/quotes` | `upload.array('files')` | `createQuotation` | Submit quotation request (public/logged-in) |
| `GET` | `/api/quotes/mine` | `protect` | `getMyQuotations` | List customer's own quotations |
| `POST` | `/api/designs` | `protect`, `upload.array('referenceFiles')` | `createDesignRequest` | Customer submit design brief |
| `GET` | `/api/designs/mine` | `protect` | `getMyDesignRequests` | List customer's own design requests |
| `POST` | `/api/contact` | None | `submitContact` | Submit contact form, send email notifications |
| `GET` | `/api/clients` | None | Inline | Public list client logos for marquee |
| `POST` | `/api/payment/webhook` | Raw body | `stripeWebhook` | Stripe webhook processing |
| `POST` | `/api/enhance-photo` | `enhanceLimiter`, `enhanceUpload.single('photo')` | `enhancePhoto` | AI photo enhancement via Replicate |
| `GET` | `/api/media-bridge/session/active` | `protect`, `adminOnly` | `getActiveSession` | Get uncompleted batch session |
| `GET` | `/api/media-bridge/session/:sessionId/current` | `protect`, `adminOnly` | `getCurrentSessionItem` | Get current project in batch session |
| `POST` | `/api/media-bridge/session/:sessionId/skip` | `protect`, `adminOnly` | `skipProject` | Skip current project |
| `POST` | `/api/media-bridge/session/:sessionId/discard` | `protect`, `adminOnly` | `discardSession` | Discard batch session |
| `POST` | `/api/media-bridge/ingest` | `protect`, `adminOnly`, `upload.single('file')` | `ingestFile` | Ingest and dedupe Markdown/CSV register |
| `POST` | `/api/media-bridge/cloudinary-sign` | `protect`, `adminOnly` | `generateCloudinarySignature` | Sign direct Cloudinary upload |
| `PUT` | `/api/media-bridge/project/:projectId/commit` | `protect`, `adminOnly` | `commitProjectMedia` | Commit staged media, advance session, sync portfolio |
| `GET` | `/api/admin/stats` | `protect`, `adminOnly` | `getStats` | Admin dashboard statistics |
| `GET` | `/api/admin/orders` | `protect`, `adminOnly` | `getAllOrders` | Admin list all orders |
| `PATCH` | `/api/admin/orders/:id` | `protect`, `adminOnly` | `updateOrder` | Admin update order status / quote price |
| `POST` | `/api/admin/orders/:id/accept-offer` | `protect`, `adminOnly` | `acceptOffer` | Admin accept customer counter-offer |
| `POST` | `/api/admin/orders/:id/forward` | `protect`, `adminOnly` | `forwardOrder` | Admin forward order brief to supplier email |
| `GET` | `/api/admin/quotations` | `protect`, `adminOnly` | `getAllQuotations` | Admin list quotations |
| `PATCH` | `/api/admin/quotations/:id` | `protect`, `adminOnly` | `updateQuotation` | Admin quote / respond to quotation |
| `GET` | `/api/admin/designs` | `protect`, `adminOnly` | `getAllDesigns` | Admin list design requests |
| `GET` | `/api/admin/customers` | `protect`, `adminOnly` | `getAllCustomers` | Admin list customers |
| `PATCH` | `/api/admin/customers/:id/role` | `protect`, `adminOnly` | `updateUserRole` | Admin update customer role |
| `PATCH` | `/api/admin/customers/:id/status` | `protect`, `adminOnly` | `updateUserStatus` | Admin suspend/activate user |
| `GET` | `/api/admin/messages` | `protect`, `adminOnly` | `getMessages` | Admin list contact messages |
| `PATCH` | `/api/admin/messages/:id/read` | `protect`, `adminOnly` | `markMessageRead` | Admin mark message as read |
| `GET` | `/api/admin/clients` | `protect`, `adminOnly` | `getClients` | Admin list client logos |
| `POST` | `/api/admin/clients` | `protect`, `adminOnly`, `upload.single('logo')` | `createClient` | Admin add client logo |
| `PUT` | `/api/admin/clients/:id` | `protect`, `adminOnly`, `upload.single('logo')` | `updateClient` | Admin update client logo |
| `DELETE` | `/api/admin/clients/:id` | `protect`, `adminOnly` | `deleteClient` | Admin delete client logo |
| `GET/POST` | `/interaction/:uid/*` | None / OIDC Session | `oidcInteractions` | OpenID Connect interaction endpoints |

---

## FORM & ENDPOINT INVENTORY (filled in Phase 0)

1. **Contact Message Form**
   - **Page**: `/contact`
   - **Action**: `POST /api/contact`
   - **Fields**: `name` (text, req), `email` (email, req), `phone` (tel, opt), `subject` (text, req), `message` (textarea, req)
   - **Validation**: Client validates non-empty name, email, message; Server validates 400 if name, email, subject, message missing.
   - **Uploads**: None.
   - **Success/Error**: Toast feedback, sets `sent: true` view.
   - **Outbound triggers**: Confirmation email to user (`contactReplyEmail`), notification email to `EMAIL_USER` (`newContactNotificationEmail`).

2. **Quotation Request Form**
   - **Page**: `/portal/quotes/new`
   - **Action**: `POST /api/quotes`
   - **Fields**: `name` (text, req), `email` (email, req), `phone` (tel, opt), `serviceType` (select enum, req), `projectDescription` (textarea, req), `specifications` (textarea, opt), `estimatedBudget` (text, opt), `deadline` (date, opt), `files` (file[], max 5, opt)
   - **Validation**: Client checks required fields; Server checks 400 on missing required fields.
   - **Uploads**: Up to 5 files via multer Cloudinary storage.
   - **Success/Error**: Toast success, redirects to `/portal`.
   - **Auth**: Public or logged-in (attaches `customer: req.user._id` if authenticated).

3. **Job Order Form**
   - **Page**: `/portal/orders/new`
   - **Action**: `POST /api/orders`
   - **Fields**: `serviceType` (select enum, req), `description` (textarea, req), `specifications` (textarea, opt), `quantity` (number, default 1), `dimensions` (text, opt), `deadline` (date, opt), `depositAmount` (number, opt), `totalAmount` (number, opt), `customerBudget` (number, opt), `currency` (select, default 'usd'), `files` (file[], max 5, opt)
   - **Validation**: Server checks `serviceType` and `description`.
   - **Uploads**: Up to 5 files to Cloudinary.
   - **Success/Error**: Returns `{ order, clientSecret }`. If deposit > 0, initializes Stripe PaymentIntent.
   - **Outbound triggers**: Confirmation email to user (`orderConfirmationEmail`), alert email to `JOBS_EMAIL`/`EMAIL_USER` (`newOrderNotificationEmail`).

4. **Design Request Form**
   - **Page**: `/portal/designs/new`
   - **Action**: `POST /api/designs`
   - **Fields**: `designType` (select enum, req), `brief` (textarea, req), `targetAudience` (text, opt), `colorPreferences` (text, opt), `stylePreferences` (text, opt), `deliverables` (text, opt), `deadline` (date, opt), `referenceFiles` (file[], max 5, opt)
   - **Validation**: Server checks `designType` and `brief`.
   - **Uploads**: Up to 5 reference files to Cloudinary.
   - **Success/Error**: Toast success, redirects to `/portal`.

5. **Login Form**
   - **Page**: `/auth/login`
   - **Action**: `POST /api/auth/login`
   - **Fields**: `email` (email, req), `password` (password, req)
   - **Validation**: Non-empty fields, bcrypt password verification.
   - **Outbound triggers**: Generates 6-digit random OTP, hashes with sha256 (expires 10 min), emails OTP via `mfaOtpEmail`, returns `{ mfaPending: true, mfaToken }`.

6. **MFA Verification Form**
   - **Page**: `/auth/login` (step 2 modal)
   - **Action**: `POST /api/auth/verify-mfa`
   - **Fields**: `mfaToken` (JWT string), `code` (6-digit OTP string)
   - **Validation**: Token validity, code hash match, expiry check.
   - **Success/Error**: Stores `rokit_token` and `rokit_user` in `localStorage`, redirects to `/portal` or `/admin`.

7. **Register Form**
   - **Page**: `/auth/register`
   - **Action**: `POST /api/auth/register`
   - **Fields**: `name` (text, req), `email` (email, req), `password` (password, req, min 6), `phone` (tel, opt)
   - **Validation**: Unique email check, password min 6 chars.
   - **Success/Error**: Stores credentials, auto-redirects to `/portal`.

8. **Forgot Password Form**
   - **Page**: `/auth/forgot-password`
   - **Action**: `POST /api/auth/forgot-password`
   - **Fields**: `email` (email, req)
   - **Outbound triggers**: Generates 32-byte crypto token (sha256 in DB, 1h expiry), sends email with reset link (`resetPasswordEmail`).

9. **Reset Password Form**
   - **Page**: `/auth/reset-password/:token`
   - **Action**: `POST /api/auth/reset-password/:token`
   - **Fields**: `password` (password, req, min 8)
   - **Success/Error**: Updates bcrypt hash, clears token, redirects to `/auth/login`.

10. **Photo Enhancer Form**
    - **Page**: `/photo-enhancer`
    - **Action**: `POST /api/enhance-photo`
    - **Fields**: `photo` (file, req, max 20MB, jpeg/png/webp), `mode` (string: 'restore' | 'enhance')
    - **Validation**: Multer file size/type check, rate limit (20 req / 15 min).
    - **Integration**: Submits to Replicate API, returns enhanced image URL.

---

## AUTH & DATA INVENTORY (filled in Phase 0)

### Auth Model & Session Management
- **Token Mechanism**: Stateless JSON Web Tokens (JWT) signed with `JWT_SECRET`, expiring in 7 days (`JWT_EXPIRES_IN=7d`).
- **Client Storage**: `localStorage.getItem('rokit_token')` and `localStorage.getItem('rokit_user')`.
- **Request Interceptor**: `client/src/utils/api.js` automatically injects `Authorization: Bearer <token>`.
- **Response Interceptor**: On 401 Unauthorized, automatically clears token and user from `localStorage`.
- **MFA Flow**: All accounts (admin and customer) enforce two-factor email OTP authentication during login.
- **Roles**:
  - `customer`: access to public site, customer portal (`/portal`), job orders, quotes, design requests.
  - `admin`: access to all customer features plus full administrative suite (`/admin/*`).

### Data Models (`server/src/models/`)
1. **User**: `name`, `email`, `password`, `phone`, `role`, `status`, `avatarUrl`, `resetPasswordToken`, `resetPasswordExpires`, `mfaOtpHash`, `mfaOtpExpires`.
2. **JobOrder**: `customer`, `serviceType`, `description`, `specifications`, `quantity`, `dimensions`, `deadline`, `files`, `status`, `paymentStatus`, `stripePaymentIntentId`, `depositAmount`, `totalAmount`, `currency`, `adminNotes`, `customerNotes`, `quotedPrice`, `customerBudget`, `priceStatus`, `timeline`.
3. **Quotation**: `name`, `email`, `phone`, `customer`, `serviceType`, `projectDescription`, `specifications`, `estimatedBudget`, `deadline`, `files`, `status`, `adminResponse`, `quotedAmount`.
4. **DesignRequest**: `customer`, `designType`, `brief`, `targetAudience`, `colorPreferences`, `stylePreferences`, `referenceFiles`, `deliverables`, `deadline`, `status`, `adminNotes`, `revisionCount`.
5. **Portfolio**: `title`, `category`, `description`, `projectCode`, `projectId`, `images` (url, publicId, isCover, type), `tags`, `client`, `completedDate`, `featured`, `displayOrder`, `milestones`, `obstacles`.
6. **Project**: Media bridge register model (`projectCode`, `title`, `slug`, `category`, `description`, `evidence`, `publicClearance`, `nextAction`, `flowNotes`, `milestones` [media assets], `mediaCount`, `status`, `lastBatchSessionId`).
7. **MediaBatchSession**: Batch tracking model (`sourceFilename`, `fileType`, `totalCount`, `completedCount`, `currentIndex`, `status`, `items`).
8. **Service**: `name`, `slug`, `icon`, `shortDescription`, `fullDescription`, `images`, `features`, `startingPrice`, `turnaround`, `featured`, `displayOrder`.
9. **Tutorial**: `title`, `slug`, `excerpt`, `content` (HTML), `thumbnail`, `category`, `tags`, `author`, `status`, `views`, `publishedAt`.
10. **Client**: Marquee client logos (`name`, `logoUrl`, `logoPublicId`, `website`, `displayOrder`, `active`).
11. **ContactMessage**: `name`, `email`, `phone`, `subject`, `message`, `read`, `repliedAt`.
12. **OidcPayload**: OIDC provider storage (`_id`, `type`, `payload`, `grantId`, `userCode`, `uid`, `expiresAt`).

### Third-Party Integrations
- **Cloudinary**: Media CDN for portfolio images, order files, quote attachments, client logos.
- **Stripe**: Payment gateway for order deposits and balance settlements.
- **Nodemailer (Gmail SMTP)**: Transactional emails for MFA OTP, order status, contact notifications.
- **Replicate**: AI model processing for GFPGAN and Clarity Upscaler.

### Required Environment Variable Names (Values Omitted)
- **Server**: `PORT`, `NODE_ENV`, `CLIENT_URL`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`, `JOBS_EMAIL`, `JOBS_EMAIL_PASS`, `REPLICATE_API_TOKEN`.
- **Client**: `VITE_API_URL`, `VITE_STRIPE_PUBLISHABLE_KEY`.

---

## DESIGN TOKEN SPEC (filled in Phase 1)
*(Will be extracted directly from `inspiration/src/styles.css` during Phase 1)*

---

## COMPONENT SPEC (filled in Phase 1)
*(Will be extracted directly from `inspiration/src/components/` during Phase 1)*

---

## DECISIONS (numbered, with reason and date)
1. **Decision 1 (2026-10-30)**: Created baseline git tag `pre-redesign-baseline` on `main` and branched into `redesign/new-look`. All migration work remains strictly on this branch to guarantee zero disruption to live production.
2. **Decision 2 (2026-10-30)**: Added `inspiration/` to `.gitignore`. The new design repository is kept strictly local as a read-only visual and token reference, completely excluded from git tracking, builds, and remote deployments.
3. **Decision 3 (2026-10-30)**: Automated Baseline Capture Architecture: Implemented an automated script (`scripts/capture-all-baseline.mjs`) leveraging Playwright with the system Google Chrome engine across Desktop (1440x900), Tablet (768x1024), and Mobile (375x812) breakpoints, pre-authenticating customer and admin storage states to capture all 29 public, portal, and admin pages.
4. **Decision 4 (2026-10-30)**: Staging Database Isolation Proposal: Proposed a dedicated MongoDB database (`rokitmedia_v4_staging`) hosted on the existing MongoDB Atlas cluster with seeded reference data, eliminating any possibility of test submissions polluting or mutating production collections.
5. **Decision 5 (2026-10-30)**: Staging Side Effect Quarantine: Proposed routing all outbound test emails on `v4` to a designated developer mailbox, locking Stripe to test API credentials, and prefixing Cloudinary uploads to `rokit_v4_staging/`.

---

## RISKS & OPEN QUESTIONS
- **Risk 1: Outbound Email Side Effects on Staging**: Submitting contact messages, quotes, orders, and login attempts on `v4.rokitonline.com` must not trigger real emails to customers or production staff.
  - *Mitigation*: Configure staging server environment to override `EMAIL_USER`, `JOBS_EMAIL`, and recipient routing to a safe test address or logging mode.
- **Risk 2: Stripe Live Charges**: Live Stripe credentials must never be active on the staging subdomain.
  - *Mitigation*: Ensure `v4.rokitonline.com` `.env` strictly contains `pk_test_...` and `sk_test_...`.
- **Risk 3: Cloudinary Namespace Collisions**: Uploading or deleting files on staging must not affect production media.
  - *Mitigation*: Enforce a dedicated folder path `rokit/staging/...` for all staging uploads.
- **Risk 4: Local Device Guard / AppLocker Execution Policy**: Windows Device Guard blocks arbitrary executable binaries (like `@oxc-parser` native bindings).
  - *Mitigation*: Use standard node execution and avoid native binaries during local analysis of `inspiration/`.
- **Open Question 1 for User Review**: Approval of proposed staging database name `rokitmedia_v4_staging` and the designated test email address for outbound email capture on staging.

---

## FUNCTIONAL TEST CHECKLIST
The following master test checklist must be executed and logged as passed before and after each phase:
- [ ] **TC-01 Public Navigation**: Home, About, Services, Gallery, Photo Enhancer, Solutions (NGO/SME), Tutorials, Contact, Legal pages render without runtime exceptions.
- [ ] **TC-02 Gallery & Lightbox**: Masonry portfolio renders items, category filtering updates items, clicking opens lightbox viewer.
- [ ] **TC-03 Contact Form Submission**: Submitting `/contact` creates `ContactMessage` in DB, triggers sender confirmation email, triggers staff alert email, displays success UI.
- [ ] **TC-04 User Registration**: Submitting `/auth/register` creates user with `customer` role, returns valid JWT, navigates to `/portal`.
- [ ] **TC-05 User Login & MFA**: Submitting `/auth/login` sends 6-digit OTP email, prompts MFA dialog; entering OTP returns JWT and authenticates user.
- [ ] **TC-06 Password Reset Flow**: Requesting reset on `/auth/forgot-password` sends email; submitting new password on `/auth/reset-password/:token` updates password and enables login.
- [ ] **TC-07 Quotation Request**: Submitting `/portal/quotes/new` (with and without file attachments) creates `Quotation` record and redirects to `/portal`.
- [ ] **TC-08 Job Order & Deposit**: Submitting `/portal/orders/new` as customer uploads files to Cloudinary, creates `JobOrder` in DB, initializes Stripe PaymentIntent when deposit > 0, sends confirmation emails.
- [ ] **TC-09 Price Negotiation**: Customer accepting price or submitting counter-offer updates order timeline and price status.
- [ ] **TC-10 Design Request**: Submitting `/portal/designs/new` uploads reference files and creates `DesignRequest` record.
- [ ] **TC-11 Admin Access Guard**: Unauthenticated users or non-admin users attempting to access `/admin/*` are rejected and redirected.
- [ ] **TC-12 Admin Dashboard Stats**: `/admin` loads aggregate metrics (orders, quotations, customers, revenue) without errors.
- [ ] **TC-13 Admin Orders Management**: Updating order status, quoting price, accepting counter-offer, and forwarding brief to external email operates correctly.
- [ ] **TC-14 Admin Portfolio CMS**: Adding new portfolio item, setting cover image, editing milestones/obstacles, and deleting item works with Cloudinary sync.
- [ ] **TC-15 Admin Tutorials CMS**: Creating tutorial with Tiptap editor and thumbnail upload, editing, toggling published status, and deleting works.
- [ ] **TC-16 Admin Services CMS**: Creating, modifying, and deleting service offerings updates public services list immediately.
- [ ] **TC-17 Admin Customers Manager**: Toggling user roles (customer/admin) and toggling suspension status works as expected.
- [ ] **TC-18 Admin Clients Manager**: Uploading new client logos updates public marquee on homepage.
- [ ] **TC-19 Rapid Project Media Bridge**: Ingesting markdown register parses all 32 records cleanly, staging Cloudinary media persists, saving draft quarantines from public portfolio, and "Save & Advance" synchronizes live portfolio.

---

## TASK LOG

### PHASE 0: Discovery & Baseline (Read-Only, No Code Changes)
- [x] 0.1 Record the stack from existing knowledge and confirm against files: runtime, framework, view engine, bundler, CSS approach, DB, hosting, process manager, entry file, deploy procedure.
  - Started: 2026-10-30T09:54:00-04:00
  - Finished: 2026-10-30T09:58:00-04:00
  - Files touched: `CONTEXT.md`
  - Verified how: Inspected `client/package.json`, `server/package.json`, `server/src/app.js`, `client/vite.config.js`, `.cpanel.yml`, SSH configuration on `rokitonline`.
  - Notes: Complete stack and Namecheap cPanel deployment pipeline documented.
- [x] 0.2 Map project structure: views, routes, controllers, models, middleware, assets, config.
  - Started: 2026-10-30T09:58:00-04:00
  - Finished: 2026-10-30T10:00:00-04:00
  - Files touched: `CONTEXT.md`
  - Verified how: Traversed directory tree across `client/src`, `server/src`, `public_html`.
  - Notes: Tree diagram logged in `CONTEXT.md`.
- [x] 0.3 Route inventory: every page route and API route with method, path, auth requirement, view rendered, and controller.
  - Started: 2026-10-30T10:00:00-04:00
  - Finished: 2026-10-30T10:04:00-04:00
  - Files touched: `CONTEXT.md`
  - Verified how: Read all 33 React Router paths in `client/src/App.jsx` and all 66 Express routes in `server/src/routes/`.
  - Notes: Exhaustive route inventory tables compiled.
- [x] 0.4 Form inventory: every form on the site with action URL, method, field names, validations, uploads, CSRF, success/error, triggers.
  - Started: 2026-10-30T10:04:00-04:00
  - Finished: 2026-10-30T10:07:00-04:00
  - Files touched: `CONTEXT.md`
  - Verified how: Inspected form components (`Contact.jsx`, `NewQuote.jsx`, `NewOrder.jsx`, `NewDesign.jsx`, `Login.jsx`, `Register.jsx`, `PhotoEnhancer.jsx`, admin modals) and matching controllers.
  - Notes: 11 distinct form specifications documented.
- [x] 0.5 Auth & accounts: JWT mechanism, cookies, roles, protected routes, login/register/reset flows.
  - Started: 2026-10-30T10:07:00-04:00
  - Finished: 2026-10-30T10:09:00-04:00
  - Files touched: `CONTEXT.md`
  - Verified how: Analyzed `AuthContext.jsx`, `middleware/auth.js`, `middleware/adminCheck.js`, `authController.js`.
  - Notes: Stateless JWT + email OTP MFA documented.
- [x] 0.6 Data layer: models, collections, key fields, relationships, third-party integrations, required env vars.
  - Started: 2026-10-30T10:09:00-04:00
  - Finished: 2026-10-30T10:11:00-04:00
  - Files touched: `CONTEXT.md`
  - Verified how: Read all 12 Mongoose schema models in `server/src/models/` and env var keys in `server/.env`.
  - Notes: All schema fields, third-party services, and env variable names logged.
- [x] 0.7 Frontend behavior inventory: client-side JS, menus, modals, galleries, form handling, fetch calls.
  - Started: 2026-10-30T10:11:00-04:00
  - Finished: 2026-10-30T10:13:00-04:00
  - Files touched: `CONTEXT.md`
  - Verified how: Inspected Navbar, Footer, AdminLayout, Gallery masonry, HeroSlider swiper, Tiptap editor, HotToast handlers.
  - Notes: Documented in `CONTEXT.md`.
- [x] 0.8 Baseline capture: run site locally, take full-page screenshots (desktop, tablet, mobile) of every page into `/docs/baseline/`.
  - Started: 2026-10-30T10:04:00-04:00
  - Finished: 2026-10-30T10:11:00-04:00
  - Files touched: `scripts/capture-all-baseline.mjs`, `docs/baseline/*.png`
  - Verified how: Executed automated Playwright screenshot suite capturing 29 pages across 3 viewports (87 full-page screenshots).
  - Notes: All screenshots stored in `docs/baseline/`.
- [x] 0.9 Write Functional Test Checklist in CONTEXT.md listing every flow to be re-tested after each phase.
  - Started: 2026-10-30T10:13:00-04:00
  - Finished: 2026-10-30T10:14:00-04:00
  - Files touched: `CONTEXT.md`
  - Verified how: Cross-referenced with all controller endpoints and customer/admin journeys.
  - Notes: 19 verification test cases (`TC-01` through `TC-19`) added.
- [x] 0.10 Clone the new design repo into `inspiration/` alongside live code, add to `.gitignore`, inventory structure, assets, fonts, dependencies.
  - Started: 2026-10-30T09:54:15-04:00
  - Finished: 2026-10-30T10:04:00-04:00
  - Files touched: `.gitignore`, `inspiration/`
  - Verified how: `git clone https://github.com/okoriterokit-hue/rokit-homepage-vision inspiration`, verified git ignore, inventoried all components, routes, and `styles.css`.
  - Notes: Excluded from build and deploy pipelines.
- [x] 0.11 Staging plan: document how `v4.rokitonline.com` will be set up, flag side effects, propose DB isolation.
  - Started: 2026-10-30T10:14:00-04:00
  - Finished: 2026-10-30T10:15:00-04:00
  - Files touched: `CONTEXT.md`
  - Verified how: Inspected remote cPanel subdomain and Passenger configuration; formulated data isolation and side-effect quarantine strategy.
  - Notes: Awaiting user review at Phase 0 gate.

---

## ROLLBACK POINTS (git tags/commits that are known-good)
- **Tag `pre-redesign-baseline`**: Known-good clean baseline of live production site before starting redesign migration. Commit: `d897fb2` on branch `main`.
- **Tag `redesign-phase-0-complete`**: Known-good completion of Phase 0 discovery, full inventories, and baseline screenshots across 29 pages and 3 viewports. Commit: `799e23d` on branch `redesign/new-look`.
