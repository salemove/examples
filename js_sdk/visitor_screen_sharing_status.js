// Reference:
// https://js-sdk-docs.salemove.com/class/ScreenSharing.html
// https://js-sdk-docs.salemove.com/class/VisitorScreenSharingState.html
// Check for visitor screen sharing status during the engagement

try {
    sm.getApi({ version: 'v1' }).then(glia => {
      glia.addEventListener(glia.EVENTS.ENGAGEMENT_START, engagement => {
        engagement.screenSharing.addBufferedEventListener(
            engagement.screenSharing.EVENTS.VISITOR_STATE_UPDATE,
                function(state) {
                    if (state.status === state.STATUSES.SHARING) {
                        console.log("Visitor is sharing the screen");
                    } else if (state.status === state.STATUSES.NOT_SHARING) {
                        console.log("Visitor is not sharing the screen");
                    }
                }
            );
      });
    });
  } catch (err) {
    console.error('Error while checking for visitor screen sharing status', err);
  }