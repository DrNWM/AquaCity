Finally we have a shared folder workspace !!!


Project: AquaCity Engineer — Browser-Based 2D Water Management Game
Context:
We are building a browser-based 2D puzzle game inspired by Where's My Water, targeting players with basic knowledge in mechanical and public health engineering. The core mechanic: players route clean water to a community threatened by a nearby polluted lake, across 5 progressive stages (Beginner → Expert).
Game Stages Summary:

Stage 01 — The Village Well: Gravity-based pipe routing, no pollution yet
Stage 02 — Polluted Lake Appears: Sand filter placement, contamination avoidance
Stage 03 — Multi-Zone City District: Budget system (RM 5.00), 3 zones (hospital, school, market)
Stage 04 — Chemical Spill Crisis: Multi-stage treatment train, real-time sensors (turbidity, pH)
Stage 05 — AquaCity Full System: Full city network, monsoon events, population growth, dynamic budget, leaderboard

Target Platform: Browser only (no native app). 2D HTML5/Canvas or Phaser.js game engine.
Cloud Architecture to Build:

Firebase Authentication — Google Sign-In + anonymous play (claim account later)
Firebase Hosting — serve static game assets
Cloud CDN — fast asset delivery
Firestore — player profiles, stage progress, star ratings, leaderboard scores collection
Cloud Run — server-side score validation (anti-cheat) and leaderboard aggregation

What we need built, step by step:

Project scaffold — HTML5 game shell with Phaser.js, connected to Firebase project
Firebase Auth — anonymous login on game launch, Google Sign-In to save progress
Firestore schema — players collection, scores collection with indexed leaderboard query
Stage 01 playable prototype — gravity pipe routing with win condition
Budget system — reusable cost-deduction logic for Stages 03–05
Cloud Run service — score submission endpoint with basic validation
Firebase Hosting + Cloud CDN deployment config
Leaderboard UI — top 10 scores from Firestore, shown after Stage 05

Constraints:

We are new to Firebase — explain each step before generating code
Use Planning Mode, not Fast Mode — we want to review every Artifact before execution
Target total cloud cost under RM 5.00/month on Google Cloud free tier + pay-as-you-go
Game must run entirely in browser — no backend required for Stages 01–04


# Game Specification: AquaCity Engineer
**Context:** A 2D browser-based puzzle game inspired by Where's My Water.

## Game Stages Summary

### Stage 01 — The Village Well
- **Setting:** A small village with a well and a community garden.
- **Mechanics:** Players route clean water from the well to the garden using basic pipe pieces (straight, elbow, T-junction).
- **Win Condition:** All 3 plant plots in the garden receive water simultaneously.
- **No Pollution:** Pure water, no contamination mechanics.

### Stage 02 — Polluted Lake Appears
- **Setting:** The village is now threatened by a polluted lake.
- **New Element:** A polluted water source flows from the lake towards the village.
- **Mechanics:** Players must use a sand filter to purify the water before it reaches the garden.
- **Win Condition:** All 3 plant plots receive clean, filtered water.

### Stage 03 — Multi-Zone City District
- **Setting:** A small city district with 3 distinct zones: Hospital, School, and Market.
- **Mechanics:**
    - **Budget System:** Players start with RM 5.00.
    - Each pipe segment and filter costs money (e.g., straight pipe = RM 0.50, filter = RM 2.00).
    - Players must route water to all 3 zones within budget.
- **Win Condition:** All 3 zones receive clean water.

### Stage 04 — Chemical Spill Crisis
- **Setting:** A chemical factory near the city experiences a spill, contaminating the water source.
- **Mechanics:**
    - **Multi-Stage Treatment:** Requires a sequence of treatment units (e.g., sedimentation tank → sand filter → UV sterilizer).
    - **Real-Time Sensors:** In-game indicators for water quality (turbidity, pH).
    - Players must balance cost with effectiveness to meet safety standards.
- **Win Condition:** Water meets all safety standards across all zones.

### Stage 05 — AquaCity Full System
- **Setting:** The entire city of AquaCity with a complex water network.
- **Mechanics:**
    - **Population Growth:** Increasing demand for water.
    - **Monsoon Events:** Occasional heavy rainfall that can overwhelm the system or cause contamination.
    - **Dynamic Budget:** Funding adjusts based on water quality and population needs.
    - **Leaderboard:** High scores based on efficiency, speed, and sustainability.
- **Win Condition:** Maintain safe water supply for the entire city under various challenges.

## Technical Details

### Target Platform
- Browser-based only
- HTML5/Canvas or Phaser.js
- Responsive design for desktop and mobile

### Required Technologies
- **Firebase Authentication:** Google Sign-In + anonymous play
- **Firebase Hosting:** Serve static game assets
- **Cloud CDN:** Fast asset delivery
- **Firestore:** Player profiles, stage progress, leaderboard scores
- **Cloud Run:** Server-side score validation and leaderboard aggregation

## Design Principles
1. **Progressive Difficulty:** Each stage introduces new mechanics gradually
2. **Educational Value:** Teaches basic water treatment principles
3. **Replayability:** Challenges, leaderboards, and dynamic events
4. **Budget Management:** Players must make strategic decisions
5. **Visual Feedback:** Clear indicators for water quality and system status

## Cloud Cost Target
- Under RM 5.00/month on Google Cloud free tier + pay-as-you-go
