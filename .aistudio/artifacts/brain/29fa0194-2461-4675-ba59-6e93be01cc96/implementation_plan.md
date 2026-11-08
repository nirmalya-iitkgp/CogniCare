# NeuroPulse Diagnostics — 7-Stage Clinical Assessment Suite

A clinical-grade gamified diagnostic platform that assesses cognitive, motor, visual, and auditory milestones across seven human life stages. It combines a 7-way split interactive hero viewport inspired by clinical reference partitioning with a 28-test diagnostic sandbox, millisecond-accurate biometric logging, normative percentiles, and printable diagnostic telemetry reports.

## User Review & Critical Decisions

> [!IMPORTANT]
> The platform follows the confirmed preferences from Phase 1 clarification:
> - **Visual Direction**: Clean clinical light mode with high-contrast scientific typography (`Plus Jakarta Sans` + `IBM Plex Mono`), crisp hairline borders, and distinct life-stage accent hues without decorative pill tags or buzzwords.
> - **Game & Assessment Scope**: Full 28-test clinical battery across all 7 zones, featuring instant-play sandboxes with configurable assessment parameters (duration, target speeds, stimulus intervals).
> - **Diagnostic Telemetry**: Comprehensive clinical scorecard with millisecond reaction latency histograms, omission/commission error breakdowns, normative percentile ranks, and exportable reports (JSON and printable PDF summaries).

- **Confirmed Decision 1**: Clean clinical light aesthetic with 7 life-stage color accents (Infant Teal, Early Childhood Amber, School Age Azure, Adolescent Violet, Young Adult Emerald, Adult Slate, Geriatric Crimson).
- **Confirmed Decision 2**: Interactive 7-way split hero accordion layout with hover expansion, keyboard navigation, and direct deep-linking into each zone's clinical battery.
- **Confirmed Decision 3**: 100% deterministic local clinical calculations; zero AI/LLM dependency in accordance with clinical protocol and privacy requirements.

---

## 1. Overview & Core Concept

- **What It Does**: Provides validated diagnostic game protocols spanning 0 to 61+ years of age. Each life stage hosts 4 interactive tests measuring motor control, sensory processing, executive functioning, and neurodegenerative markers.
- **Target Audience / Persona**: Clinical neurologists, pediatricians, occupational therapists, sports medicine evaluators, and individuals performing baseline cognitive checkups.
- **Key Value**: Replaces anxiety-inducing paper-and-pencil or clinical equipment tests with engaging, millisecond-precise gamified interactions while preserving diagnostic rigor (TOVA, Ishihara, Corsi Block, Stroop, Tower of London, ImPACT, PVT, PASAT, Humphrey Perimetry, CANTAB RVP, Trail Making A/B, MoCA, Clock Drawing).

---

## 2. User Experience & Visual Design

### 7-Way Split Hero Viewport

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [NeuroPulse Diagnostics]                   · Zones · All 28 Tests · Session History ·   │
├─────────┬─────────┬─────────┬──────────┬──────────┬──────────┬──────────┬──────────────┤
│ Zone 1  │ Zone 2  │ Zone 3  │ Zone 4   │ Zone 5   │ Zone 6   │ Zone 7   │ Live Telemetry│
│ 0–3 Yrs │ 4–6 Yrs │ 7–12 Yrs│ 13–18 Yrs│ 19–30 Yrs│ 31–60 Yrs│ 61+ Yrs  │ Active Sample│
│ Infancy │ Early   │ School  │ Teen     │ Young    │ Working  │ Geriatric│ Normative %  │
│ Motor   │ Visual  │ Exec    │ Concuss. │ Psych    │ Field/RV │ Tremor   │              │
├─────────┴─────────┴─────────┴──────────┴──────────┴──────────┴──────────┴──────────────┤
│ Active Test Stage / Interactive Game Playfield (60fps Canvas / Audio Engine / SVG)     │
│ [Test Parameters: Speed / Trials / Difficulty] ─── [Real-time Latency: 242ms]           │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Hero Interaction**: 7 vertical columns spanning the full width. Hovering or focusing a column expands its width smoothly (flex transition), displaying the zone title, age bracket, clinical focus, and direct launch buttons for its 4 clinical tests.
- **Visual Identity**:
  - *Palette*: Clinical white canvas (`#FFFFFF` / `#F8FAFC`), cool structural slate borders (`#E2E8F0`), deep ink typography (`#0F172A`).
  - *Zone Accents*: Disciplined 10% accent color per zone (Teal `#0D9488`, Amber `#D97706`, Azure `#2563EB`, Violet `#7C3AED`, Emerald `#059669`, Indigo `#4F46E5`, Crimson `#E11D48`).
  - *Typography*: `Plus Jakarta Sans` for clean scientific interface headers; `IBM Plex Mono` / `tabular-nums` for reaction latency readouts, coordinates, and decibel levels.
  - *Zero-Pill Discipline*: No decorative pill tags or floating badges. Information uses clean unboxed typography with dot separators (`Zone 1 · 0–3 Years · Bayley Scales`).

---

## 3. Key Product Decisions & Clinical Test Matrix

### Complete 28-Test Clinical Engine Matrix

| Zone | Age Bracket | Test 1 | Test 2 | Test 3 | Test 4 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Zone 1** | 0–3 Yrs (Infants) | **Tiny Touch Paws** (Bayley Touch Precision) | **Novelty Peek** (Fagan Visual Habituation) | **Sound Hop** (Behavioral Stereo Audiometry) | **Hide & Seek Box** (Piaget Object Permanence) |
| **Zone 2** | 4–6 Yrs (Early) | **Space Pilot Go/No-Go** (TOVA / CPT) | **Hidden Jungle Safari** (Ishihara Plates) | **Memory Pattern Simon** (Corsi Block Tapping) | **Tracing Master** (Beery VMI Vector Tracing) |
| **Zone 3** | 7–12 Yrs (School) | **Rule Switcher** (DCCS Dimensional Card Sort) | **Color Clash** (Pediatric Stroop Interference) | **Block Stacker 3D** (Tower of London Problem Solving) | **Shape Matcher** (Benton Visual Discrimination) |
| **Zone 4** | 13–18 Yrs (Teens) | **Reflex Grid** (ImPACT Post-Concussion Baseline) | **Night Drive Speedometer** (PVT Psychomotor Vigilance) | **High-Stakes Deck** (Iowa Gambling Task IGT) | **Logic Matrix** (Wisconsin Card Sorting WCST) |
| **Zone 5** | 19–30 Yrs (Young Adult)| **Life Canvas** (PHQ-9 Psychometric RPG) | **Calm State** (GAD-7 Anxiety Decision Matrix) | **Rhythm Math** (PASAT Auditory Working Memory) | **Cyber Grid Decipher** (Sternberg Memory Scanning) |
| **Zone 6** | 31–60 Yrs (Adult) | **Star Field Perimetry** (Humphrey Visual Field) | **Radar Operator** (CANTAB Rapid Visual Processing) | **Pathfinder Rush** (Trail Making Parts A & B) | **Tone Tuner** (Pure-Tone Sine Wave Audiometry) |
| **Zone 7** | 61+ Yrs (Geriatric) | **Speed Tapper** (Finger Tapping Motor Fatigue) | **Steady Hand Canvas** (Fahn-Tolosa-Marin Tremor) | **Farmer's Market Manager** (MoCA / MMSE Executive) | **Digital Timekeeper** (Clock Drawing Test CDT) |

- **Audio Engine**: Pure Web Audio API oscillators synthesizing calibrated sine waves (250Hz–8000Hz for Tone Tuner, directional stereo panning for Sound Hop, auditory number streams for PASAT).
- **Vector & Canvas Engines**: HTML5 2D Canvas with sub-pixel pointer tracking measuring drawing smoothness, tremor frequency analysis via peak-to-peak variance, and shape closure for Beery VMI and Clock Drawing Test.
- **Reporting Engine**: Local diagnostic score sheet tracking response times (mean, median, standard deviation), error counts, and comparison with clinical normative ranges.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              App State                                 │
│  - Active Zone (1–7)                                                   │
│  - Active Test Engine (28 Clinical Protocols)                          │
│  - Session Telemetry Store (Latencies, Accuracies, Normatives)          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┼────────────────────────┐
           ▼                        ▼                        ▼
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│  SplitHeroNavigation │ │   DiagnosticEngine   │ │   TelemetryReport    │
│  - 7 Interactive     │ │  - Canvas Vector Lab │ │  - Latency Histograms│
│    Vertical Slices   │ │  - Web Audio Synthes.│ │  - Percentile Scores │
│  - Quick Assessment  │ │  - Precision Timers  │ │  - Clinical Analysis │
│    Launcher Modal    │ │  - Touch/Pointer Hub │ │  - PDF/JSON Export   │
└──────────────────────┘ └──────────────────────┘ └──────────────────────┘
```

### Component Hierarchy & File Modularity

To comply with the modularity instructions:
- `src/types/clinical.ts`: Domain models, zone descriptors, test schemas, and metric interfaces.
- `src/utils/audioEngine.ts`: Web Audio API sound generator for stereo audiometry, pure-tone frequencies, and feedback chimes.
- `src/utils/normativeData.ts`: Age-stratified clinical norms and percentile calculation algorithms.
- `src/components/layout/Navbar.tsx`: Strict one-row top bar following the design constitution.
- `src/components/hero/SplitHero.tsx`: The 7-way split hero accordion with smooth layout animation and zone previews.
- `src/components/zones/ZoneOverview.tsx`: Test browser for a selected life stage with configurable parameters.
- `src/components/diagnostics/DiagnosticRunner.tsx`: Isolated game host orchestrating round state, timer clamping, and feedback.
- `src/components/diagnostics/engines/`: Modular test components organized by zone (Infant, Childhood, School, Teen, YoungAdult, Adult, Geriatric).
- `src/components/reports/ClinicalReportModal.tsx`: Comprehensive diagnostic summary, SVG latency distribution charts, and export actions.
- `src/tests/clinical.test.ts`: Automated unit test suite verifying normative calculations, scoring metrics, and state machines.
- `vite.config.ts` & `.github/workflows/deploy.yml`: Configured for GitHub Pages deployment as requested in additional instructions.

---

## 5. Verification & Security Plan

1. **Unit Testing**: Automated tests covering:
   - Normative percentile score transformations.
   - TOVA omission/commission rate algorithms.
   - Trail Making executive shifting delta ($TMT_B - TMT_A$).
   - Tremor frequency calculation and variance extraction.
2. **Security & Red-Pill / Blue-Pill Boundary**:
   - Zero remote telemetry transmission without consent.
   - Strict XSS sanitation on exported reports and user notes.
   - Client-side data sandboxing in `localStorage`.
3. **Compilation & Linting**:
   - Verification via `compile_applet` and `lint_applet`.
   - Zero console warnings or memory leaks on Web Audio contexts.
