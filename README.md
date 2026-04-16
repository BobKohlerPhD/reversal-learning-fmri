# Probabilistic Reversal Learning Task for functional Magnetic Resonance Imaging (fMRI)


## Experimental Paradigm
The PRL task requires participants to identify high probability reward stimuli through trial-and-error. The current implementation utilizes geometric SVGs as stimuli with clear coloring and definition.

### Design
 Four distinct blocks, each comprising 18 trials (n = 72 trials). For each block, a unique pair of geometric shapes is presented.
 
 Participants choose between two stimuli with reciprocal reward probabilities (e.g., 0.80 vs. 0.20). At a pre-determined point within each block, the contingency is reversed without warning. 

### Trial Structure
Each trial follows a standardized temporal sequence:
1.  **Stimulus Presentation and Choice Display**: A fixed 2500ms interval during which participants must register a response.
2.  **Feedback Phase**: The selected stimulus is highlighted with a high-contrast border to signal a selection, followed by the presentation of a "win" or "loss" label.
3.  **Inter-Trial Interval (ITI)**: Jittered fixation period between 2000ms and 5000ms

## How to use and Important File Locations
Task has both standalone and integrated formats:
*   `index.html`: A self-contained web application incorporating all necessary logic for local administration.
*   `rev-learning-fmri.js`: A script optimized for Gorilla Task Builder platform.
*   `spreadsheet_data.json` & `spreadsheet.csv`: Configuration files defining trial-by-trial probabilities, reward, and blocks.
*   `/images/`: Visual stimuli and general task-related imagery

### Operational Procedures
The run file, `index.html`, has been tested on chrome and safari. After entering participant ID and confirming the keybind for triggering scanner, the task got to a full screen mode. 

After the experiment is completed, behavioral data is automatically exported in a CSV format. Raw data can also theoretically be retrieved manually via the interface if the experiment crashes, etc 
