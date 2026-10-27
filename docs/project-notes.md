# Project Engineering Notes & Implementation Details

## Key Engineering Decisions

1. **Decoupled Modern React 18 Architecture**:
   - Converted the vanilla single-page prototype into a fully reactive React component hierarchy.
   - Clean state lifecycles trigger real-time updates: e.g., submitting a quiz immediately refreshes the top navigation header score pill and the dashboard composite readiness meter.

2. **Resilient PostgreSQL Integration**:
   - Configured with `pg.Pool` with connection retry and schema auto-execution.
   - Implemented an embedded, high-performance in-memory adapter as a zero-crash fallback if the PostgreSQL service is booting up or if testing in environments without local database binaries.

3. **Domain-Specific AI Service Layer**:
   - Configured to consume Google Gemini (`GEMINI_API_KEY`) or OpenAI endpoints via environment variables.
   - Includes full-featured heuristic intelligence to ensure offline testability and robust campus viva defense without external latency or cost barriers.

4. **Security & Validation**:
   - Password hashing using `bcryptjs` with salt factor 10.
   - JWT tokens signed with `jsonwebtoken` and verified via Express middleware.
   - SQL parameterized queries preventing SQL injection vulnerabilities.
