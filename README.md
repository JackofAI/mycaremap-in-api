# MyCareMap API Server (`mycaremap-api`)

Standalone REST API backend for MyCareMap — a proactive lifelong personal health navigation system.

## Features
- **CareMap Core**: Full CRUD for lifelong care map states, completeness calculations, fresh user creation, and MeraCare cross-platform imports.
- **Appointments & Doctor Visit Prep**: 2-minute appointment preps, discussions topics, previous visit notes, and structured summaries.
- **Providers & Care Team**: Multi-specialty doctor directories, clinics, and care circles (local and remote family navigators).
- **Commitments & Daily Care**: Daily meds, routine checkups, lifestyle actions, and follow-ups.
- **Family Circles**: Lifelong multi-generational care management (Papa, Mummy, Spouse, Children).
- **Patterns & Signals**: Symptom trends, BP/Sugar flags, between-visit observations, and alerts.
- **Auth & DPDP Compliance**: Complete privacy compliance, token-based sessions, explicit consent tracking, and audit trails.
- **Ask AI / Gemini**: Intelligent medical question answering with resilient offline contextual fallbacks.

## API Endpoints

### System & Health
- `GET /api/health` — Server health, uptime, and active profile status.

### Authentication
- `POST /api/auth/register` — Register a new user with mobile/email and initialize care state.
- `POST /api/auth/login` — Sign in with credentials and receive auth token.
- `GET /api/auth/session` — Validate active session via Bearer token.
- `POST /api/auth/logout` — Revoke active token.
- `DELETE /api/auth/account` — Delete account and purge data (DPDP Act).

### Care Map State
- `GET /api/caremap` — Get current care state and completeness score.
- `PUT /api/caremap` — Update entire care state.
- `POST /api/caremap/reset` — Reset to default demo state.
- `POST /api/caremap/fresh` — Initialize fresh user with clean profile.
- `POST /api/caremap/import` — Import clinical data and providers from MeraCare.

### Care Modules
- `GET /api/commitments` | `POST /api/commitments` | `PUT /api/commitments/:id` | `DELETE /api/commitments/:id`
- `GET /api/providers` | `POST /api/providers` | `PUT /api/providers/:id` | `DELETE /api/providers/:id`
- `GET /api/appointments` | `POST /api/appointments` | `PUT /api/appointments/:id` | `DELETE /api/appointments/:id`
- `GET /api/instructions` | `POST /api/instructions` | `PUT /api/instructions/:id` | `DELETE /api/instructions/:id`
- `GET /api/records` | `POST /api/records` | `DELETE /api/records/:id`
- `GET /api/signals` | `POST /api/signals`
- `GET /api/inbox` | `POST /api/inbox` | `PUT /api/inbox/:id/dismiss`
- `GET /api/family` | `POST /api/family` | `PUT /api/family/:id` | `DELETE /api/family/:id`
- `GET /api/analytics` | `POST /api/analytics/track`
- `POST /api/ask` — Clinical query answering (Google Gemini + contextual fallback).
- `GET /api/audit` — Security and DPDP compliance audit log.

## Getting Started

```bash
# 1. Install dependencies
cd mycaremap-api
npm install

# 2. Start development server (with auto-reload on port 3001)
npm run dev

# 3. Build for production
npm run build

# 4. Run production server
npm start
```
