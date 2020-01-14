sm.getApi({ version: 'v1' }).then(function (salemove) {
  const customCommandEventListener = function (engagement) {
    const coBrowseStateHanlder = function(cobrowsingState) {
      if (cobrowsingState.mode === engagement.cobrowser.MODES.ENGAGEMENT) {
        // when Operator sends an invite to the Visitor to CoBrowse
        // and the Visitor accepts
        // then it prints in the console a notification
        console.log("CoBrowsing started")
      }
    }
    
  engagement.cobrowser.addBufferedEventListener(
      engagement.cobrowser.EVENTS.MODE_CHANGE,
      coBrowseStateHanlder
    ); 
  }
  salemove.addEventListener(salemove.EVENTS.ENGAGEMENT_START, customCommandEventListener);
});
