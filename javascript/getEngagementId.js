sm.getApi().then(
  function(salemoveApi)
  {
    salemoveApi.addEventListener(
      salemoveApi.EVENTS.ENGAGEMENT_START,
      function(engagement) 
      { 
        console.log('the engagement with id ' + engagement.engagementId + ' started!')
      }
    );

    salemoveApi.addEventListener(
      salemoveApi.EVENTS.ENGAGEMENT_END,
      function(engagement) 
      { 
        console.log('the engagement with id ' + engagement.engagementId + ' ended!')
      }
    );
  },
  function(err)
  { 
    console.log("An error occured: ", err)
  }
);
