/*
 **************************************
 *
 * (POMODORO) SCRIPT.JS
 *
 **************************************
 * Started working on: 2019
 * Last edit: 2023.07.01, 22:50
 */

let activeTimer = null;


// ======================================================================
// DOCUMENT - CONTENT LOADED
// ======================================================================
document.addEventListener('DOMContentLoaded', function () {
  // ---------------------------------------------
  // TEMP
  // --------------------------------------------- 
  const todayList = document.getElementsByClassName('today');
  for (let i = 0; i < todayList.length; i++) {
    todayList[i].innerHTML = formatTime(Date.now());
  }



  // ---------------------------------------------
  // VARIABLES
  // --------------------------------------------- 

  let timerInterval = 10; // in milliseconds
  // Buttons Text
  let workBtnTxt = '▶︎';
  let breakBtnTxt = '~';
  let longBreakBtnTxt = '~~';
  let pauseBtnTxt = '//';
  let stopBtnTxt = '◼︎';
  let settingsBtnTxt = '⚙';

  // Colors
  let workColor = '#d80000';
  let breakColor = '#23ba23';
  let neutralColor = '#EFEFEF';
  let buttonsColor = '#AFAFAF';

  // ---------------------------------------------
  // GET ALL ELEMENTS → CREATE WIDGETS
  // --------------------------------------------- 
  // Get all elements with the 'andriaa-pomodoro' class
  const pomodoroWidgets = document.getElementsByClassName('andriaa-pomodoro');

  const audio = new Audio("https://www.fesliyanstudios.com/play-mp3/387");

  // Iterate over each pomodoro widget
  Array.from(pomodoroWidgets).forEach(function (pomodoroWidget) {
      // Variables to track active timer and intervals
      let activeTimer = null;
      let workInterval;
      let breakInterval;
      let longBreakInterval;

      // Generate the HTML code for the widget
      const html = `
        <div class="andriaa-pomodoro from-js" data-work="${pomodoroWidget.dataset.work}" data-break="${pomodoroWidget.dataset.break}" data-longbreak="${pomodoroWidget.dataset.longbreak}">
          <div class="timers">
            <div class="pomodoro-timer">
              <div class="workTimer">${pomodoroWidget.dataset.work}:00</div>
            </div>
            <div class="pomodoro-timer">
              <div class="breakTimer">${pomodoroWidget.dataset.break}:00</div>
            </div>
            <div class="pomodoro-timer">
              <div class="longBreakTimer">${pomodoroWidget.dataset.longbreak}:00</div>
            </div>
          </div>
          <div class="progressBars">
            <div class="progressBar workProgressBar" style="width: 100%;"></div>
            <div class="progressBar breakProgressBar"></div>
            <div class="progressBar longBreakProgressBar"></div>
            <div class="progressBar progressBar-bg"></div>
          </div>
          <div class="buttons">
            <button class="pomodoro-button work-button">${workBtnTxt}</button>
            <button class="pomodoro-button break-button">${breakBtnTxt}</button>
            <button class="pomodoro-button long-break-button">${longBreakBtnTxt}</button>
            <button class="pomodoro-button stop-button">${stopBtnTxt}</button>
            <button class="pomodoro-button settings-button">${settingsBtnTxt}</button>
          </div>
        </div>
      `;

      // Insert the generated HTML into the widget element
      pomodoroWidget.innerHTML = html;

      // Get the timer elements for the current widget
      const workTimer = pomodoroWidget.querySelector('.workTimer');
      const breakTimer = pomodoroWidget.querySelector('.breakTimer');
      const longBreakTimer = pomodoroWidget.querySelector('.longBreakTimer');

      // Get the button elements for the current widget
      const workButton = pomodoroWidget.querySelector('.work-button');
      const breakButton = pomodoroWidget.querySelector('.break-button');
      const longBreakButton = pomodoroWidget.querySelector('.long-break-button');
      const stopButton = pomodoroWidget.querySelector('.stop-button');
      const settingsButton = pomodoroWidget.querySelector('.settings-button');

      const workTime = parseInt(pomodoroWidget.dataset.work) * 60;
      const breakTime = parseInt(pomodoroWidget.dataset.break) * 60;
      const longBreakTime = parseInt(pomodoroWidget.dataset.longbreak) * 60;
      let workSeconds = workTime;
      let breakSeconds = breakTime;
      let longBreakSeconds = longBreakTime;

      // Set the initial timer values for the current widget
      workTimer.textContent = pomodoroWidget.dataset.work + ':00';
      breakTimer.textContent = pomodoroWidget.dataset.break + ':00';
      longBreakTimer.textContent = pomodoroWidget.dataset.longbreak + ':00';

      // ======================================================================
      // START TIMERS
      // ======================================================================
      // ---------------------------------------------
      // START WORK TIMER
      // ---------------------------------------------
      // Function to start the work timer for the current widget
      function startWorkTimer() {
        if (activeTimer === workButton) {
            // Timer is already running, pause it
            workInterval = pauseTimer(workInterval);

        } else {
            // Timer is not running, start it
            activeTimer = workButton;

            // Button text
            workButton.textContent = pauseBtnTxt;
            
            // Button colors
            workButton.style.color = workColor;
            breakButton.style.color = buttonsColor;
            longBreakButton.style.color = buttonsColor;

            // Hide timers
            setVisibility(workTimer, "inherit");
            setVisibility(breakTimer, "none");
            setVisibility(longBreakTimer, "none");
 
            // SET INTERVAL
            workInterval = setInterval(() => {
              workSeconds--;
              if (workSeconds < 0) {
                workInterval = clearInterval(workInterval);
                timerComplete();
                stopTimers();
                return;
              }

              const display = formatTime(workSeconds);
              workTimer.textContent = display;
              const progress = ((workTime - workSeconds) / workTime) * 100;

              updateProgressBars('workProgressBar', progress);

              
            }, timerInterval);
          }
      }

      // ---------------------------------------------
      // START BREAK TIMER
      // ---------------------------------------------
      // Function to start the break timer for the current widget
      function startBreakTimer() {
        if (activeTimer === breakButton) {
            // Timer is already running, pause it
            breakInterval = pauseTimer(breakInterval);
        } else {
            // Timer is not running, start it
            activeTimer = breakButton;

            // Button colors
            workButton.style.color = buttonsColor;
            breakButton.style.color = breakColor;
            longBreakButton.style.color = buttonsColor;

            // Hide timers
            setVisibility(workTimer, "none");
            setVisibility(breakTimer, "inherit");
            setVisibility(longBreakTimer, "none");

            // SET INTERVAL
            breakInterval = setInterval(() => {

              // Decrement timer
              breakSeconds--;

              // Stop timer?
              if (breakSeconds < 0) {
                breakInterval = clearInterval(breakInterval);
                timerComplete();
                stopTimers();
                return;
              }

              // Update Timer Display
              const display = formatTime(breakSeconds);
              breakTimer.textContent = display;

              // Update Progress bars
              const progress = ((breakTime - breakSeconds) / breakTime) * 100;
              updateProgressBars('breakProgressBar', progress);
            }, timerInterval);
          }
      }

      // ---------------------------------------------
      // START LONG BREAK TIMER
      // ---------------------------------------------
      // Function to start the long break timer for the current widget
      function startLongBreakTimer() {
        if (activeTimer === longBreakButton) {
            // Timer is already running, pause it
            longBreakInterval = pauseTimer(longBreakInterval);
        } else {
            // Timer is not running, start it
            activeTimer = longBreakButton;

            // Button colors
            workButton.style.color = buttonsColor;
            breakButton.style.color = buttonsColor;
            longBreakButton.style.color = breakColor;

            // Hide timers
            setVisibility(workTimer, "none");
            setVisibility(breakTimer, "none");
            setVisibility(longBreakTimer, "inherit");
   
            // SET INTERVAL
            longBreakInterval = setInterval(() => {
              longBreakSeconds--;
              if (longBreakSeconds < 0) {
                longBreakInterval = clearInterval(longBreakInterval);
                timerComplete();
                stopTimers();
                return;
              }

              // Update Timer Display
              const display = formatTime(longBreakSeconds);
              longBreakTimer.textContent = display;

              // Update Progress Bars
              const progress = ((longBreakTime - longBreakSeconds) / longBreakTime) * 100;
              updateProgressBars('longBreakProgressBar', progress);
            }, timerInterval);
          }
      }

      // ---------------------------------------------
      // PAUSE TIMER
      // ---------------------------------------------
      // Function to pause a timer
      function pauseTimer(interval) {
        interval = clearInterval(interval);
        return interval;
      }

      // ---------------------------------------------
      // RESUME TIMER
      // ---------------------------------------------
      function resumeTimer() {
         
          // --------------------
          // WORK BUTTON
          // --------------------
          if (activeTimer === workButton) {
               
                // SET INTERVAL
                workInterval = setInterval(() => {             
                  // Decrement timer
                  workSeconds--;
                  
                  // Is timer over?
                  if (workSeconds < 0) {
                    workInterval = clearInterval(workInterval);
                    timerComplete();
                    stopTimers();
                    return;
                  }
                   
                  // Update Timer Display
                  const display = formatTime(workSeconds);
                  workTimer.textContent = display;

                  // Update Progress Bar
                  const progress = ((workTime - workSeconds) / workTime) * 100;
                  updateProgressBars('workProgressBar', progress);

                }, 1000);                  
          // --------------------
          // BREAK BUTTON
          // --------------------    
          } else if (activeTimer === breakButton) {
                
                // SET INTERVAL
                breakInterval = setInterval(() => {
                  
                  // Decrement timer
                  breakSeconds--;
                  if (breakSeconds < 0) {
                    breakInterval = clearInterval(breakInterval);
                    timerComplete();
                    stopTimers();
                    return;
                  }

                  // Update Timer Display
                  const display = formatTime(breakSeconds);
                  breakTimer.textContent = display;

                  // Update Progress Bar
                  const progress = ((breakTime - breakSeconds) / breakTime) * 100;
                  updateProgressBars('breakProgressBar', progress);
                }, 1000);

          // --------------------
          // LONG BREAK BUTTON
          // --------------------  
          } else if (activeTimer === longBreakButton) {
           
              // SET INTERVAL
              longBreakInterval = setInterval(() => {
                // Decrement timer
                longBreakSeconds--;

                // Is timer over?
                if (longBreakSeconds < 0) {
                  longBreakInterval = clearInterval(longBreakInterval);
                  timerComplete();
                  stopTimers();
                  return;
                }

                // Update Timer Display
                const display = formatTime(longBreakSeconds);
                longBreakTimer.textContent = display;

                // Update Progress Bar
                const progress = ((longBreakTime - longBreakSeconds) / longBreakTime) * 100;
                updateProgressBars('longBreakProgressBar', progress);
              }, 1000);
           }    
      }



      // ---------------------------------------------
      // UPDATE PROGRESS BARS
      // ---------------------------------------------
      function updateProgressBars(bar, prog) {
          pomodoroWidget.querySelector('.' + bar).style.width = prog + '%';
      }
function timerComplete(){
    let tmp = "";
    switch (activeTimer){
      case workButton:
           tmp = "work";
          break;
      case breakButton:
          tmp = "break";
          break;
       case longBreakButton:
          tmp = "long break";
          break;
    }
    displayMsg(tmp + " timer complete");
    audio.play();
}


      // ---------------------------------------------
      // STOP ALL TIMERS
      // ---------------------------------------------
      // Function to stop all timers
      function stopTimers() {
          displayMsg("Stop all timers");
          workInterval = clearInterval(workInterval);
          breakInterval = clearInterval(breakInterval);
          longBreakInterval = clearInterval(longBreakInterval);
          activeTimer = null;

          // Reset Timers
          // Set the initial timer values for the current widget

          workSeconds = workTime;
          breakSeconds = breakTime;
          longBreakSeconds = longBreakTime;

          workTimer.textContent = pomodoroWidget.dataset.work + ':00';
          breakTimer.textContent = pomodoroWidget.dataset.break + ':00';
          longBreakTimer.textContent = pomodoroWidget.dataset.longbreak + ':00';

          // Reset button colors
          workButton.style.color = buttonsColor;
          breakButton.style.color = buttonsColor;
          longBreakButton.style.color = buttonsColor;

          // Reset button text
          workButton.textContent = workBtnTxt;
          breakButton.textContent = breakBtnTxt;
          longBreakButton.textContent = longBreakBtnTxt;

          // Reset progress bars
          updateProgressBars('workProgressBar', 0);
          updateProgressBars('breakProgressBar', 0);
          updateProgressBars('longBreakProgressBar', 0);

          // Hide timers
          setVisibility(workTimer, "inherit");
          setVisibility(breakTimer, "none");
          setVisibility(longBreakTimer, "none");
      }


      // ---------------------------------------------
      // SETTINGS
      // ---------------------------------------------
      // Function to access settings
      function settingsAccess(){
          //var element = document.body;
          pomodoroWidget.classList.toggle("fullscreen");
      }

      // ---------------------------------------------
      // DARK MODE
      // ---------------------------------------------
      // Function to access settings
      function darkModeToggle(){
          //var element = document.body;
          pomodoroWidget.classList.toggle("dark-mode");
      }

      // ======================================================================
      // BUTTONS - ADD EVENT LISTENERS
      // ======================================================================
      // ---------------------------------------------
      // WORK BUTTON - Event Listener
      // ---------------------------------------------
      // Event listeners for the buttons in the current widget
      workButton.addEventListener('click', function() { 
          // ALREADY RUNNING
          if (activeTimer === workButton) {
            // PAUSE TIMER
            if (workInterval) {
              displayMsg("Pause timer : work");
              workInterval = clearInterval(workInterval);
              workInterval = null;
              // Update button text
              workButton.textContent = workBtnTxt;
            }
            // RESUME TIMER
            else {
              displayMsg("Resume timer : work");
              // Update button text
              workButton.textContent = pauseBtnTxt;
              resumeTimer();
            }
          }
          // START TIMER
          else {
            displayMsg("Start timer : work");
            stopTimers();


            // Update button text
            workButton.textContent = pauseBtnTxt;
            startWorkTimer();
            
          }
      });

      // ---------------------------------------------
      // BREAK BUTTON - Event Listener
      // ---------------------------------------------
      breakButton.addEventListener('click', function() { 
          // ALREADY RUNNING
          if (activeTimer === breakButton) {
            // PAUSE TIMER
            if (breakInterval) {
              displayMsg("Pause timer : break");
              breakInterval = clearInterval(breakInterval);
              breakInterval = null;
              // Update button text
              breakButton.textContent = breakBtnTxt;
            }
            // RESUME TIMER
            else {
              displayMsg("Resume timer : break");
              // Update button text
              breakButton.textContent = pauseBtnTxt;
              resumeTimer();
            }
          }
          // START TIMER
          else {
            displayMsg("Start timer : break");
            stopTimers();
            // Update button text
             breakButton.textContent = pauseBtnTxt;
            startBreakTimer();
          }
      });

      // ---------------------------------------------
      // LONG BREAK BUTTON - Event Listener
      // ---------------------------------------------
      longBreakButton.addEventListener('click', function() { 
          // ALREADY RUNNING
          if (activeTimer === longBreakButton) {
            // PAUSE TIMER
            if (longBreakInterval) {
              displayMsg("Pause timer : long break");;
              longBreakInterval = clearInterval(longBreakInterval);
              longBreakInterval = null;
              // Update button text
              longBreakButton.textContent = longBreakBtnTxt;
            }
            // RESUME TIMER
            else {
              displayMsg("Resume timer : long break");
              // Update button text
              longBreakButton.textContent = pauseBtnTxt;
              resumeTimer();
            }
          }
          // START TIMER
          else {
            stopTimers();
            displayMsg("Start timer : long break");
            // Update button text
            longBreakButton.textContent = pauseBtnTxt;
            startLongBreakTimer();
          }
      });

      // ---------------------------------------------
      // STOP BUTTON - Add Event Listeners
      // ---------------------------------------------
      stopButton.addEventListener('click', stopTimers);


      // ---------------------------------------------
      // SETTINGS BUTTON - Add Event Listeners
      // ---------------------------------------------
      settingsButton.addEventListener('click', settingsAccess);

      // ---------------------------------------------
      // SETTINGS BUTTON - Add Event Listeners
      // ---------------------------------------------
      workTimer.addEventListener('click', darkModeToggle);
      breakTimer.addEventListener('click', darkModeToggle);
      longBreakTimer.addEventListener('click', darkModeToggle);
 
      // Reset all timers on load
      stopTimers();
  });

  // ======================================================================
  // HELPERS
  // ======================================================================
  // ---------------------------------------------
  // FORMAT TIME
  // ---------------------------------------------  
  // Function to format time in MM:SS format
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function displayMsg(msg){
    console.log(" ----- " + msg);
  }

  function setVisibility(obj, displayValue){
    //obj.style.opacity = opacity;
    obj.style.display = displayValue;
  }
});
