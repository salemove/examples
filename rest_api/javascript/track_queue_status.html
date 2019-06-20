<script type="text/javascript" src="https://api.salemove.com/salemove_integration.js"></script>
 <div>
  <div class='instructions'></div>
  <button class='cancel'>Leave queue</button>
  <div class='queue' queue_id='a6d8feb6-c300-4409-9e8a-c9842648c6ef'>
    <span> Queue Sales Chat Status </span>
  </div>
  <div class='queue' queue_id='806bf1d9-392f-40b1-9228-0a99abd59688'>
    <span> Queue Sales Rich Media Status </span>
  </div>
  <div class='queue' queue_id='4c525415-e11f-46c6-8c34-4a36f8f11dcc'>
    <span> Queue Service Chat Status </span>
  </div>
  <div class='queue' queue_id='df94560d-af53-4836-a83d-1c405e291c0a'>
    <span> Queue Service Rich Media Chat Status </span>
  </div>
</div>
<script>
  function findQueuingInstructionsElement() {
    return document.querySelector('div.instructions');
  }
  function findQueueElement(queueName) {
    return document.querySelector("div.queue[queue_id='" + queueName + "']");
  }
  function findAllQueueElements() {
    return document.querySelectorAll('div.queue');
  }
  function showCanQueue(queueElement, queueMedias) {
    // Queue is open, a set of medias available
    queueElement.style['text-decoration'] = 'none';
  }
  function showCannotQueue(queueElement) {
    // Queue is closed
    queueElement.style['text-decoration'] = 'line-through';
  }
  // Handle Queue state changes for a particular queue.
  // Enable queuing and media buttons for available media if open, disable
  // otherwise.
  function onQueueState(queue) {
    console.log("Queue state change ", queue);
    var queueElement = findQueueElement(queue.name);
    if (queueElement === null) {
      // Queue not related to the current page, ignore
    } else if (queue.state.status === queue.state.STATUSES.OPEN) {
      showCanQueue(queueElement, queue.state.medias);
    } else {
      showCannotQueue(queueElement);
    }
  }
  function showCannotQueueAnywhere() {
    findAllQueueElements().forEach(showCannotQueue);
  }
  // Initial state: Cannot queue
  showCannotQueueAnywhere();
  // Get Glia API and bind listeners. 
  // Please refer to https://js-sdk-docs.salemove.com/class/Salemove.html
  sm.getApi({version: 'v1'})
  .then(function(api) {
    api.getQueues()
      .then(function(queues) {
        var queueIds = queues.map(function(queue) { return queue.id });
        api.subscribeToQueueStateUpdates(queueIds, onQueueState);
      });
  });
</script>