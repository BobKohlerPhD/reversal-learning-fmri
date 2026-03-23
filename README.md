# fMRI Reversal Learning Task (Geometric Theme)

This project is a variant of the Probabilistic Reversal Learning task, using high-contrast **Geometric SVG stimuli** instead of the original fruit images. This ensures consistent luminance and perfect scaling for fMRI projectors.

## Key Changes in this Version
- **Stimuli**: Uses 8 geometric shapes (Circle, Square, Triangle, Diamond, Hexagon, Octagon, Cross, Star).
- **Format**: All stimuli are **SVG** files for maximum clarity and luminance control.
- **Visual Feedback**: The "Selection" effect is achieved via a high-contrast white border (`_bold.svg`).

## Experiment Design
- **Task Type**: Probabilistic Reversal Learning.
- **Goal**: Participants must maximize their score by identifying the "High-Reward" stimulus through trial-and-error feedback.
- **Trial Structure**: The task consists of **72 trials** divided into **4 blocks** of 18 trials each.
- **Reversal Mechanism**: Within each block, reward probabilities (e.g., 80% vs. 20%) unexpectedly swap.
- **Stimulus Strategy**: A new geometric pair is introduced for each block.

## fMRI Optimization
- **Scanner Synchronization**: The task establishes a precise **T0** upon receiving the trigger key (default: `5`), aligning all behavioral logs with the BOLD signal.
- **Jittered ITI**: Inter-trial intervals (fixation) are randomly jittered between **2000–5000ms** to allow for effective deconvolution of the hemodynamic response.
- **Response Window**: Participants have a fixed **2500ms** window to make a choice, ensuring consistent trial timing.
- **Luminance Consistency**: A neutral grey background (`#d1d1d1`) is used to minimize eye strain and maintain consistent visual activation in the scanner.

## Task Flow
1. **Scanner Wait**: Holds on a fixation/wait screen until the trigger key is detected.
2. **Choice Trial**: Participant selects a fruit using keys `1` (Left) or `2` (Right).
3. **Feedback (Opening Effect)**: The selected fruit "opens" (swaps to `_bold.png`) to reveal a Win (`win.png`) or Loss (`loss.png`) icon.
4. **ITI**: A fixation cross (`+`) is shown during the jittered rest period.
5. **Happiness Rating**: Periodically, participants rate their current mood on a 1–5 scale using `1` (Decrease) and `2` (Increase).

## Project Structure
- `index.html`: The primary standalone application. Includes CSS, HTML, and JS logic for local execution.
- `rev-learning-fmri.js`: Optimized script for use within the **Gorilla Task Builder** environment.
- `spreadsheet_data.json`: The trial-by-trial configuration (probabilities, rewards, block assignments) used by the standalone version.
- `spreadsheet.csv`: Source configuration file for the task logic.
- `/images/`: Directory containing all visual and auditory assets (stimuli, feedback icons, instructions, and sounds).

## How to Run (Standalone)
1. Ensure all assets are in the `/images/` folder.
2. Open `index.html` in a modern web browser.
3. Enter a **Participant ID** and confirm/change the **Trigger Key**.
4. The task will automatically enter **Fullscreen Mode** upon starting.
5. Press the trigger key (e.g., `5`) to simulate the scanner and begin.
6. **Data Recovery**: After completion, if the automatic CSV download fails, use the "View Raw Data" button to manually copy the results.
