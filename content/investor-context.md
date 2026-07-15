# Light Pump Labs — Investor & Ecosystem Context Pack
> For Special Agent #8 system prompt injection. Reference naturally — do not dump on the person.

---

## Ecosystem Overview

Light Pump Labs (LPL) is the parent brand for an interconnected personal development ecosystem. Every brand addresses a different dimension of human experience. Every product feeds the others. The architecture is designed so that any entry point eventually routes people through the entire system.

**Vision:** Build the infrastructure for human coherence — mind, body, heart, environment, identity — through branded experiences that compound.

**Founders:**
- **Brent Freeman** — Serial entrepreneur, AOJ facilitator. Full-time on AOJ.
- **Adam Schlender** — Engineer turned somatic practitioner. Architect of the ecosystem, facilitator of FSL/ESU, founder of SoundTemple, builder of Opus Connect.

---

## The Brand Portfolio

### Tier 1: Free (Top of Funnel)

| Brand | What It Does | Revenue Model |
|-------|-------------|---------------|
| **Rise ID** | 15-20 minute AI-guided identity experience producing a shareable digital artifact | Free — viral loop through sharing. The passport for the entire ecosystem. |
| **Light Check** | 2-3 minute diagnostic assessment routing people to the right program | Free — identifies which program fits (mind/body/heart) |

### Tier 2: Entry ($42-$197)

| Brand | What It Does | Revenue Model |
|-------|-------------|---------------|
| **Power of 42 (P42)** | 7-day AI-guided build practice, 42 minutes per session | Day 1 free, single day $42, full build $197 |

### Tier 3: Programs ($2,000-$4,000)

| Brand | What It Does | Revenue Model |
|-------|-------------|---------------|
| **Alchemy of Joy (AOJ)** | 90-day mind-track cohort with retreat | ~$2,000-$4,000 per participant |
| **Full Spectrum Love (FSL)** | 3-day somatic retreat + 30-day integration | ~$2,000-$4,000 per participant |
| **Expansive Sacred Union (ESU)** | 90-day couples/relational-track cohort | ~$2,000-$4,000 per couple |

### Tier 4: Premium ($2,500-$7,500)

| Brand | What It Does | Revenue Model |
|-------|-------------|---------------|
| **SoundTemple** | Immersive vibroacoustic experience at partner venues | Venue sessions, corporate wellness, live concerts |
| **Facilitator Certification** | Training certified SoundTemple facilitators | $2,500 / $5,000 / $7,500 (3 tiers) |
| **1:1 Coaching** | Direct coaching packages with Brent or Adam | Premium pricing TBD |

### Tier 5: Recurring (SaaS + Community)

| Brand | What It Does | Revenue Model |
|-------|-------------|---------------|
| **Opus Connect** | SaaS platform for SoundTemple venue/facilitator management | $299/mo (venues), $49/mo (facilitators) |
| **Community Membership** | Access to all portals, monthly live group | Recurring subscription TBD |

---

## The Funnel Architecture

```
Rise ID (free, 15-20 min) --> identity artifact, shareable
    |
Light Check (free, 2-3 min) --> diagnostic router
    |
    +-- Mind track --> AOJ Priority Pillars Assessment --> AOJ Cohort ($2K-$4K)
    +-- Body track --> FSL Light Body Assessment --> FSL Retreat ($2K-$4K)
    +-- Heart track --> ESU Assessment --> ESU Cohort ($2K-$4K)
    +-- Build track --> P42 Source Field Assessment --> P42 7-Day Build ($197)
    |
SoundTemple (peak experience, any stage) --> creates demand for everything above
    |
Opus Connect (platform layer) --> manages the network, generates SaaS revenue
```

**Key insight:** Every brand creates demand for every other brand. AOJ graduates want body-level experience (SoundTemple, FSL). FSL participants want mind-level depth (AOJ). P42 completers want the peak experience (SoundTemple). SoundTemple creates appetite for all programs. Rise ID is the passport that follows them everywhere.

---

## The Trinity Programs

The three core programs form an interconnected triangle:

| Program | Track | Field Name | Facilitator | Palette |
|---------|-------|-----------|-------------|---------|
| **AOJ** | Mind | Priority Field | Brent Freeman | Forest Green, Gold, Cream |
| **FSL** | Body | Somatic Field | Adam Schlender | Deep Rose, Amber, Ivory |
| **ESU** | Heart | Relational Field | Adam Schlender | Indigo, Gold, Cream |

Each program uses the same assessment engine (config-driven, swap a JSON file to redeploy for any brand) and the same portal architecture (Next.js + Notion backend).

---

## Master Phase Plan

### Phase 1-2: COMPLETE
- AOJ Portal: 31 pages, full UI/UX with demo data
- Every feature designed and functional
- Build passing clean, zero errors

### Phase 3: Wire + Deploy AOJ Portal (1-2 days)
- **Blocked by:** Notion API key and Resend API key from Brent
- Notion API integration (databases already configured)
- Auth (NextAuth + Resend magic links)
- Deployment to Vercel
- Stripe integration for self-serve purchase

### Phase 4: Rise ID (3-5 days)
- Standalone AI-guided identity experience
- 5 Dimensions of Self: Purpose, Path, Pleasure, Power, Presence
- Produces shareable digital identity artifact
- Top of funnel for entire ecosystem

### Phase 5: Complete P42 Days 3-7 (5-7 days)
- Days 1-2 built, Day 3 written but not deployed
- Days 4-7 need building
- Direct revenue target: $42/session, $197/all 7

### Phase 6: FSL + ESU Portals (3-5 days each)
- Clone AOJ portal architecture
- FSL portal MUST be ready before May 2026 retreat
- ESU follows FSL with less time pressure

### Phase 7: Ecosystem Integration (2-3 weeks)
- Light Check diagnostic router
- Cross-program dashboard
- WhatsApp bridge (Twilio)
- Biometric integrations (Whoop, Oura, Apple Health)
- Suno API for theme songs
- Content library (video hosting)

### Phase 8: Revenue Activation (ongoing)
- May 2026 FSL retreat (ANCHOR EVENT)
- P42 launch (first digital revenue)
- SoundTemple Bathehouse ATX pilot
- AOJ October 2026 cohort

### Phase 9: Platform Play (Q4 2026+)
- White-label portal framework (SaaS for any coach)
- Rise ID as universal identity product
- Presence Labs culinary arm activation
- TestimonialStudio integration

---

## Revenue Model & Pricing Architecture

### Ecosystem-Wide Pricing

| Tier | Products | Price Range |
|------|----------|-------------|
| **Free** | Rise ID, Light Check, AOJ homepage | $0 |
| **Entry** | Power of 42 | $42-$197 |
| **Programs** | AOJ Cohort, FSL Cohort, ESU Cohort | $2,000-$4,000 |
| **Premium** | SoundTemple Certification, 1:1 Coaching | $2,500-$7,500 |
| **Recurring** | Community membership, Opus Connect platform fees | Monthly subscription |

### SoundTemple Year 1 Revenue Projection

| Quarter | Revenue Range | Key Activities |
|---------|--------------|----------------|
| Q1 (Apr-Jun 2026) | $3.5K-$7K | Bathehouse ATX pilot launch |
| Q2 (Jul-Sep 2026) | $14K-$27K | Certification launch, venue #2 pipeline, corporate wellness |
| Q3 (Oct-Dec 2026) | $28K-$47K | Second venue live, certification cohort 2, platform fees begin |
| Q4 (Jan-Mar 2027) | $29K-$51K | 3+ venues, recurring revenue engine |
| **Year 1 Total** | **$66K-$123K** | Conservative ~$66K, optimistic ~$123K, most likely ~$85-95K |

### SoundTemple Revenue Streams

| Stream | Margin | Scalability |
|--------|--------|-------------|
| Venue Sessions (60/40 split) | 40% gross | Medium |
| Live Concerts (1/3 split) | ~33% gross | Medium |
| Corporate Wellness | 33-50% gross | High |
| Facilitator Certification | 80-90% gross | Very high |
| Opus Platform Fees (SaaS) | 90%+ gross | Very high |
| Equipment Leasing | 70%+ gross | High (capital intensive upfront) |

---

## Team

| Person | Role | Status |
|--------|------|--------|
| **Brent Freeman** | AOJ Facilitator, serial entrepreneur | Full-time AOJ |
| **Adam Schlender** | Ecosystem architect, FSL/ESU facilitator, SoundTemple founder | Split across SoundTemple, Opus Connect, FSL, LPL |
| **Gary** | Operations/support | 25 hours/week approved |
| **David Erickson** | Opus Connect development | Capacity constraints (.4 to 1.0 gap) |
| **Claude (Opus 4.6)** | All code, config extraction, template architecture, brand guides | Active co-builder |

---

## Investment Thesis

**Why this works:**

1. **Compounding ecosystem** — Every brand creates demand for every other brand. No single product needs to succeed alone. The flywheel compounds.

2. **Config-driven replication** — The assessment engine, portal architecture, and brand system are all config-swappable. Deploying a new brand is a JSON file change, not a rebuild.

3. **Facilitator-independent scaling** — SoundTemple certification creates operators who do not need Adam. The portal operates without Brent. The AI sessions in P42 run without either founder.

4. **Multiple revenue timelines** — Digital products (P42) generate revenue immediately. Retreats (FSL, AOJ) generate program revenue quarterly. SaaS (Opus Connect) generates recurring revenue monthly. Certification generates high-margin revenue that unlocks new venues.

5. **Network effects** — Rise ID as universal identity creates cross-platform value. Community membership across programs creates retention. Shared participant data (with consent) enables personalization across all touchpoints.

6. **Capital efficiency** — The entire ecosystem is being built by two founders plus AI tooling. No large engineering team. No venture burn rate. Revenue-generating before requiring outside capital.

---

## Traction & Current State (April 2026)

| Metric | Status |
|--------|--------|
| AOJ Portal | 31 pages complete, demo data, awaiting API keys for live wire |
| P42 | Days 1-2 built and functional, Day 3 written |
| FSL | Brand guide complete, retreat structure designed, May 2026 retreat planned |
| ESU | Brand guide complete, curriculum generated, lower time pressure |
| SoundTemple | Bathehouse ATX pilot agreement signed, 10 SoundBeds ready, 50+ session library |
| Opus Connect | In development, beta target June-July 2026 |
| Assessment Engine | Config-driven, proven with AOJ, ready to deploy for P42/FSL/ESU |
| Rise ID | Strategy documented, build planned for April 2026 |

---

## Critical Dependencies & Risks

| Dependency | What It Blocks | Status |
|-----------|---------------|--------|
| Notion API key from Brent | AOJ portal live data | Requested |
| Resend API key from Brent | AOJ portal auth | Requested |
| Opus Connect beta | SoundTemple platform management | June-July target |
| Bathehouse ATX pilot execution | Entire SoundTemple Year 1 | #1 April priority |
| FSL retreat venue/date | May 2026 revenue anchor | Confirmed May 2026 |
| Stripe account setup | All payment flows | Adam can set up |
| Adam's bandwidth | Everything not-AOJ | Split 4+ ways |

---

## Priority Sequencing

**Immediate (This Week):**
1. Deploy AOJ portal (even with demo data)
2. Get Brent's API keys

**Next 2 Weeks:**
3. Wire Notion API + Auth when keys arrive
4. Complete P42 Days 3-7 (direct revenue)

**April 2026:**
5. Rise ID build (top of funnel)
6. FSL Portal (MUST be ready for May retreat)
7. Stripe integration for AOJ + P42

**May 2026:**
8. FSL Retreat happens (portal live, participants onboard)
9. P42 launch (first digital revenue)
10. SoundTemple Bathehouse pilot

**June-September 2026:**
11. ESU Portal
12. Ecosystem integration (WhatsApp, biometrics, content library)
13. Opus Connect beta live

**October 2026:**
14. AOJ October cohort (portal battle-tested)
15. Platform play begins

---

## Financial Context

- Adam's target: $100K part-time revenue
- Savings are declining — revenue generation is urgent
- May FSL retreat is the nearest revenue anchor
- P42 is the fastest path to digital revenue ($42-$197 per participant, no retreat logistics)
- SoundTemple certification ($2,500-$7,500 per cert) is highest-margin offering
- The ecosystem is designed to be self-funding: each phase's revenue funds the next phase's build
