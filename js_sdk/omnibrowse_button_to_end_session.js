// References:
// https://js-sdk-docs.salemove.com/class/Salemove.html#addEventListener-dynamic
// https://js-sdk-docs.salemove.com/class/Salemove.html#EVENTS-variable
// Running the code snippet below creates a button, clicking on which allows to end the ongoing OmniBrowse engagement

(function() {
  const setupUI = function(){

    const cssText = function() {
      return ".button {" +
        " background-color: #4CAF50;" +
        " border: none;" +
        " color: white;" +
        " padding: 20px;" +
        " text-align: center;" +
        " text-decoration: none;" +
        " font-size: 16px;" +
        " bottom: 50px;" +
        " left: 50px;" +
        " position: fixed;" +
        " display: none;" +
        " border-radius: 12px;" +
        " margin: 4px 2px;"
    }

    const setupCss = function() {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = cssText();
      document.getElementsByTagName('head')[0].appendChild(style);
    }

     const setupDivs = function() {
      const button = document.createElement('button');
      button.id = "visitorCodeModal"
      button.setAttribute("class", "button")
      button.innerText = "End Session"
      document.body.appendChild(button);
    }
    setupCss()
    setupDivs()
  }

  const setupGliaEvents = function(){
    const modal = document.getElementById('visitorCodeModal');

    sm.getApi({
      version: 'v1'
    }).then(function(salemove) {
      const engagementStartHandler = function(engagement) {
        console.log(engagement, "engagement started")
        modal.style.display = "block";
        modal.onclick = function() {
          engagement.end()
        }
      }

      const engagementEndHandler = function(engagement) {
        console.log(engagement, "engagement ended")
        modal.style.display = "none";
      }

      salemove.addEventListener(salemove.EVENTS.ENGAGEMENT_START, engagementStartHandler);
      salemove.addEventListener(salemove.EVENTS.ENGAGEMENT_END, engagementEndHandler);

    });
  }

  setupUI()
  setupGliaEvents()
})()
