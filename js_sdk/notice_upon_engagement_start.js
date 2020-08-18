(function() {
  const setupUI = function(){

    const cssText = function() {
      return "#visitorCodeModal {" +
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

    const createLink = function(){
      const link = document.createElement('a');
      link.href = 'https://cobrowsing.com';
      link.innerText = 'Link';
      link.target = '_blank';
      return link;
    }

    const createButton = function() {
      const button = document.createElement('button');
      button.id = "endButton"
      button.setAttribute("class", "button")
      button.innerText = "End session"
      return button;
    }

    const setupDivs = function() {
      const button = document.createElement('div');
      button.id = "visitorCodeModal"
      button.setAttribute("class", "button")
      button.innerText = "Live Observation has started "
      button.appendChild(createLink())
      button.appendChild(createButton())
      document.body.appendChild(button);
    }
    setupCss()
    setupDivs()
  }

  const setupGliaEvents = function(){
  
    sm.getApi({
      version: 'v1'
    }).then(function(salemove) {
      const modal = document.getElementById('visitorCodeModal');  
      const engagementStartHandler = function(engagement) {
        modal.style.display = "block";
        button = document.getElementById('endButton');

        button.onclick = function() {
          engagement.end()
        }
      }

      const engagementEndHandler = function(engagement) {
        modal.style.display = "none";
      }

      salemove.addEventListener(salemove.EVENTS.ENGAGEMENT_START, engagementStartHandler);
      salemove.addEventListener(salemove.EVENTS.ENGAGEMENT_END, engagementEndHandler);

    });
  }

  setupUI()
  setupGliaEvents()
})()