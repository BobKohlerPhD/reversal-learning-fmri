# fMRI Reversal Learning Task

This project contains a Probabilistic Reversal Learning task optimized for fMRI environments. It supports both **Gorilla Experiment Builder** and a **standalone web-based** version.

## Experiment Design
- **Task Type**: Probabilistic Reversal Learning.
- **Goal**: Participants must maximize their score by identifying the "High-Reward" stimulus (fruit) through trial-and-error feedback.
- **Reversal Mechanism**: The reward probabilities (e.g., 80% vs. 20%) unexpectedly swap, forcing the participant to detect the change and adapt their strategy.
- **Stimulus Strategy**:
  - **Within-Block**: A consistent pair of fruits is used per block (e.g., Fruit A vs. Fruit B) to allow for stable learning and reversal detection.
  - **Across-Blocks**: New fruit pairs are introduced (8 fruits total) to "reset" the participant's learning state. This allows the fMRI analysis to capture multiple "initial learning" phases and maintain engagement.

## fMRI Optimization
- **Scanner Synchronization**: The task established a precise **T0** upon receiving the trigger key (`5`), aligning all behavioral logs with the BOLD signal.
- **Jittered ITI**: Inter-trial intervals (fixation) are jittered (2000–5000ms) to allow for effective deconvolution of the hemodynamic response.
- **Luminance Consistency**: A neutral grey background (`#d1d1d1`) is used to minimize eye strain and maintain consistent visual activation in the scanner.

## Task Flow
1. **Scanner Wait**: Holds on a fixation/wait screen until the trigger key is detected.
2. **Choice Trial**: Participant selects a fruit using keys `1` (Left) or `2` (Right).
3. **Feedback (Opening Effect)**: The selected fruit "opens" (swaps to `_bold.png`) to reveal a Win (`win.png`) or Loss (`loss.png`) icon.
4. **ITI**: A fixation cross is shown during the jittered rest period.
5. **Happiness Rating**: Participants rate current mood on a 1–5 scale using `1` (Decrease) and `2` (Increase).

## Technical Implementation
- `rev-learning-fmri.js`: Script for **Gorilla Task Builder**.
- `index.html`: Standalone immersive version with CSV export.
- `spreadsheet_data.json`: Trial-by-trial configuration (probabilities, rewards, block assignments).

## How to Run (Standalone)
1. Ensure images and sounds are in the `/images/` folder.
2. Open `index.html` in a web browser and enter a Participant ID.
3. Press `5` to simulate the scanner trigger and begin the run.
