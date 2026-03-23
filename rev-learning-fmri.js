// FMRI CONFIG FOR SCANNER KEY AND BACKGROUND COLOR
var SCANNER_TRIGGER_KEY = '5'; 
var BACKGROUND_COLOUR = '#d1d1d1';

// SCREEN NAMES
var _win_left = 'leftWin';
var _lose_left = 'leftLose';
var _win_right = 'rightWin';
var _lose_right = 'rightLose';

// SOUNDS 
var WIN_SOUND = 'winsound.mp3';
var LOSS_SOUND = 'losesound.mp3';

// GLOBAL STATE
var scannerStartTime = 0;
var totalScoreTask = 0;
var choiceTimeout = null;
var EMBEDDED_DATA = 'total_score';
var EMBEDDED_SCORE_TASK = EMBEDDED_DATA + '_task';

// --- STIMULUS PRE-PROCESSING (Geometric Theme: IDs 09-16) ---
var list_stim = ['09', '10', '11', '12', '13', '14', '15', '16'];

gorillaTaskBuilder.preProcessSpreadsheet((spreadsheet) => {
    list_stim = list_stim.sort(() => Math.random() - 0.5);
    for (var i = 0; i < spreadsheet.length; i++) {
        var row = spreadsheet[i];
        var stim1, stim2;
        if (row.randomise_blocks == 1) { stim1 = list_stim[0]; stim2 = list_stim[1]; }
        else if (row.randomise_blocks == 2) { stim1 = list_stim[2]; stim2 = list_stim[3]; }
        else if (row.randomise_blocks == 3) { stim1 = list_stim[4]; stim2 = list_stim[5]; }
        else if (row.randomise_blocks == 4) { stim1 = list_stim[6]; stim2 = list_stim[7]; }

        if (row.display === 'Trials' && stim1 && stim2) {
            var mapImage = (val, suffix) => {
                if (val === 'stim1') return stim1 + suffix;
                if (val === 'stim2') return stim2 + suffix;
                return val;
            };
            row.stim1 = mapImage(row.stim1, '_stim.svg');
            row.stim2 = mapImage(row.stim2, '_stim.svg');
            row.Image_Left = mapImage(row.Image_Left, '_stim.svg');
            row.Image_Right = mapImage(row.Image_Right, '_stim.svg');
            row.Image_Left_Bold = mapImage(row.Image_Left_Bold, '_stim_bold.svg');
            row.Image_Right_Bold = mapImage(row.Image_Right_Bold, '_stim_bold.svg');
        }
    }
    return spreadsheet;
});

function logfMRIEvent(eventName, response, metadata) {
    var currentTime = performance.now();
    var timeFromT0 = scannerStartTime > 0 ? (currentTime - scannerStartTime) : -1;
    var metric = {
        zone_type: 'fMRI_Event',
        response: response,
        event_name: eventName,
        time_from_t0: timeFromT0,
        timestamp: currentTime
    };
    if (metadata) Object.assign(metric, metadata);
    gorilla.metric(metric);
}

function playAudio(filename) {
    gorilla.audio(filename, (audio) => {
        audio.play();
        logfMRIEvent('Audio_Played', filename);
    });
}

// MAIN TASK LOGIC 
gorillaTaskBuilder.onScreenStart((spreadsheet, rowIndex, screenIndex, row, container) => {
    $('body').css('background-color', BACKGROUND_COLOUR);
    
    // Clear any existing trial timeout
    if (choiceTimeout) { clearTimeout(choiceTimeout); choiceTimeout = null; }

    if (row.display === 'BeginBlock' || row.display === 'BeginBlockHappiness') {
        if (row.display === 'BeginBlock') {
            gorilla.store(EMBEDDED_SCORE_TASK, 0, true);
            totalScoreTask = 0;
        }
        logfMRIEvent('Instruction_Onset', row.display);
        return;
    }

    if (row.display === 'ScannerWait') {
        $(document).off('keydown.scanner').on('keydown.scanner', (e) => {
            if (e.key === SCANNER_TRIGGER_KEY) {
                scannerStartTime = performance.now();
                $(document).off('keydown.scanner');
                logfMRIEvent('Scanner_Trigger_Received', SCANNER_TRIGGER_KEY);
                gorillaTaskBuilder.forceAdvance();
            }
        });
        return;
    }

    if (row.display === 'HappinessRating') {
        logfMRIEvent('Happiness_Rating_Start', 'Onset');
        var currentRating = 3;
        var updateSliderUI = () => {
            var percentage = (currentRating - 1) * 25;
            $('.mock-slider-handle, .gorilla-slider-handle').css('left', percentage + '%');
            logfMRIEvent('Slider_Moved', currentRating);
        };
        $(document).off('keydown.rating').on('keydown.rating', (e) => {
            if (e.key === '1') { if (currentRating > 1) currentRating--; updateSliderUI(); }
            else if (e.key === '2') { if (currentRating < 5) currentRating++; updateSliderUI(); }
        });

        var ratingDur = row.duration_outcome ? parseInt(row.duration_outcome) : 4000;
        choiceTimeout = setTimeout(() => {
            $(document).off('keydown.rating');
            logfMRIEvent('Happiness_Rating_AutoAdvanced', currentRating);
            gorillaTaskBuilder.forceAdvance();
        }, ratingDur);
    }

    if (row.display === 'Trials') {
        var outcomeDur = row.duration_outcome ? parseInt(row.duration_outcome) : 1500;
        var itiDur = row.duration_iti ? parseInt(row.duration_iti) : 1000;
        var choiceTimeLimit = 3000;

        if (screenIndex === 0) {
            $(document).off('keydown.response').on('keydown.response', (e) => {
                if (e.key === '1' || e.key === '2') {
                    $(document).off('keydown.response');
                    if (choiceTimeout) { clearTimeout(choiceTimeout); choiceTimeout = null; }
                    handleChoice(e.key === '1');
                }
            });
            choiceTimeout = setTimeout(() => {
                $(document).off('keydown.response');
                logfMRIEvent('Trial_Timed_Out', 'No Response');
                gorillaTaskBuilder.forceAdvance(); 
            }, choiceTimeLimit);
        }

        function handleChoice(isLeft) {
            var chosenStim = isLeft ? row.Image_Left : row.Image_Right;
            var isStim1 = (chosenStim === row.stim1);
            var prob = isStim1 ? row.stim1_prob : row.stim2_prob;
            var won = Math.random() < prob;
            var outcomeValue = won ? parseInt(row.reward_amt) : parseInt(row.loss_amt);
            
            totalScoreTask = parseInt(gorilla.retrieve(EMBEDDED_SCORE_TASK, 0, true)) + outcomeValue;
            gorilla.store(EMBEDDED_SCORE_TASK, totalScoreTask, true);

            var targetScreen = isLeft ? (won ? _win_left : _lose_left) : (won ? _win_right : _lose_right);
            playAudio(won ? WIN_SOUND : LOSS_SOUND);

            logfMRIEvent('Choice_Registered', isStim1 ? 'Stim1' : 'Stim2', { won: won });
            gorillaTaskBuilder.forceAdvance(true, false, { go_to_screen: { value: targetScreen } });
        }

        switch (screenIndex) {
            case 1: case 4: handleChoice(screenIndex === 1); break;
            case 2: case 5: case 3: case 6:
                logfMRIEvent('Outcome_Display', (screenIndex === 2 || screenIndex === 5) ? 'Win' : 'Loss');
                setTimeout(() => {
                    $(container).html('<div style="display:flex; justify-content:center; align-items:center; height:100%;"><img src="images/fixation.png" width="100"></div>');
                    logfMRIEvent('ITI_Fixation_Onset', itiDur);
                    setTimeout(() => { gorillaTaskBuilder.forceAdvance(); }, itiDur);
                }, outcomeDur);
                break;
        }
    }
});
