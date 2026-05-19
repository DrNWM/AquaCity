# Stage 05: The Ultimate Challenge & The Persistent Economy

This plan outlines the final stage, as well as a major overhaul to the game's economy based on your new Timer and Reward mechanics!

## User Review Required

> [!IMPORTANT]
> You requested a reward system: +RM 5.00 for winning a stage, and an extra +RM 5.00 for beating it in under 1 minute.
> 
> Because Stages 01 and 02 don't have a budget UI, I will still silently track your speed and reward you! By the time you reach Stage 03, your budget will be: `Base RM 10.00` + `Any bonuses you earned from Stages 01 & 02`!
>
> I will also update Stage 04's base budget to **RM 20.00** as requested.

## Open Questions

> [!WARNING]
> 1. **Time UI**: Do you want a countdown/countup timer visible on the screen in every stage so the player knows if they are beating the 1-minute mark? (I will assume YES and add a timer to the top right corner).
> 2. **Cumulative vs Reset**: Should the bonuses stack cumulatively across the entire game? For example, if you get +RM 10 on Stage 1, +RM 10 on Stage 2, +RM 10 on Stage 3, your Stage 04 budget would be Base 20 + 30 = RM 50. Is this correct?

## Proposed Changes

### 1. The Economy Overhaul (All Stages)
#### [MODIFY] `src/scenes/Stage01.js`, `Stage02.js`, `Stage03.js`, `Stage04.js`
- **Timer UI**: Add a `this.startTime` and a text UI element that updates every frame to show elapsed seconds.
- **Reward Calculation**: When `triggerWin()` is called, calculate the elapsed time.
  - `winBonus = 5`
  - `speedBonus = (elapsed <= 60 seconds) ? 5 : 0`
- **Scene Transition**: Pass `totalBonus` accumulated so far into `this.scene.start('NextStage', { bonus: newTotal })`.
- **Budget Initialization**: Change the `create()` method in Stage 03 and Stage 04 to initialize the budget as `Base + passedBonus`.
- Set Stage 04 Base Budget to **RM 20.00**.

### 2. Stage 05 Game Logic
#### [NEW] `src/scenes/Stage05.js`
- **10x10 Grid**: Set `gridSize = 10` and scale the `cellSize` down from 64 to 48 so it fits on screen without scrolling.
- **Dual Sources**: 
  - Source 1 (Clean Water) at `(0, 2)`
  - Source 2 (Polluted Water) at `(0, 7)`
- **Targets**:
  - Hospital (Requires Clean): `(9, 1)`
  - School (Requires Clean): `(9, 5)`
  - Industrial (Accepts Clean/Polluted): `(9, 8)`
- **Budget**: Base RM 30.00 + accumulated bonuses.
- **Combined BFS Flow Algorithm**: 
  - Queues from BOTH sources.
  - Applies 5-tile pressure limits (Pumps reset pressure).
  - Applies Contamination logic (Filters clean water).
  - If Polluted water hits the Hospital or School, the level fails!
  - If all 3 targets receive flow, the player WINS the game!

#### [MODIFY] `src/game.js`
- Register `Stage05` in the Phaser configuration.
