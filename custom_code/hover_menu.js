/**
This is a script to allow cobrowsing for site navigation bar created using the "Sky Mega Menu"
solution (http://voky.com.ua/showcase/sky-mega-menu/) in which dropdowns open and close based
on CSS rules using the `:hover` pseudo-class.

Pseudo-classes can not triggered programmatically - it has to be an actual user interaction.
This means we cannot mirror the act of an user hovering a menu element to the other
cobrowsing participant.

This can be solved by adding an additional method (next to CSS) for opening and closing
menu items. Namely, we can change menu items' styles based on user's mouse movements.
This works because element style changes are caught by cobrowser and sent to the operator.

Beware that this script is dependent on the structure of the menu and has been written
solely based on the structure of a certain menu.
**/

// Helper function to query from direct children.
var queryDirectChildren = function (parent, selector) {
  if (!parent.children) return [];

  var result = [];

  for (var i = 0; i < parent.children.length; i++) {
    var child = parent.children[i];
    // `msMatchesSelector` is required for IE
    var matches = child.matches || child.msMatchesSelector || undefined;
    if (matches && matches.call(child, selector)) {
      result.push(child);
    }
  }

  return result;
}

// Function that styles for a sub-menu for it to be visible
var expandMenu = function(subMenuContainerStyle, level, phoneMediaQueryList, right) {
  subMenuContainerStyle.transform = 'scale(1, 1)';
  subMenuContainerStyle.opacity = '1.0';

  // Next steps are needed for setting sub-menu location,
  // which depends on screen size, menu level and whether top menu is on the right


  // First check if we're in phone view
  if (phoneMediaQueryList.matches) {
    if (level === 2) {
      subMenuContainerStyle.left = '41px';
    } else {
      subMenuContainerStyle.left = '0';
    }
  }

  // For phone view, no other styles need to be changed, so do an early return.
  if (phoneMediaQueryList.matches) return;

  // The location for level 1 sub-menu
  if (level === 1) {
    // This basically brings sub-menu to the screen.
    // If not hovered, it's `-9999px;` to the left.
    subMenuContainerStyle.left = '0';
  // The location for level 2 sub-menu
  } else {
    if (right) {
      // if top menu item is on the right, then level 2
      // menu items are shown on the left side
      subMenuContainerStyle.right = '100%';
      subMenuContainerStyle.left = 'auto';
    } else {
      subMenuContainerStyle.left = '100%';
    }
  }
}


// Add mouse listeners to a menu item and its sub-items to change their style when hovered,
// and restore old styles when not hovered anymore.
var processMenuItem = function(menuItem, level, phoneMediaQueryList, right) {
  // Sub-menu containers are direct children of a menu item
  // and have either `grid-container3` or `grid-container7` class
  var subMenuContainers = queryDirectChildren(menuItem, '.grid-container3, .grid-container7');

  // Do nothing if menu item does not have dropdown
  if (subMenuContainers.length === 0) return {restore: function() {}};

  var subMenuContainer = subMenuContainers[0];
  var subMenuContainerStyle = subMenuContainer.style;

  // Expand menu when user hovers it
  var mouseOverListener = menuItem.addEventListener('mouseover', function(event) {
    expandMenu(subMenuContainerStyle, level, phoneMediaQueryList, right);
  });

  var restoreStyles = function() {
    subMenuContainerStyle.transform = '';
    subMenuContainerStyle.opacity = '';
    subMenuContainerStyle.right = '';
    subMenuContainerStyle.left = '';
  };

  // Close menu when not hovered anymore
  var mouseOutListener = menuItem.addEventListener('mouseout', restoreStyles);

  // Remember all items in next menu level to remove event listeners when engagement ends
  var processedSubMenuItems = [];

  // When processing first level menu, also process its sub-items
  if (level === 1) {
    var subMenuList = subMenuContainer.querySelector('ul');

    if (subMenuList) {
      var subMenuListItems = queryDirectChildren(subMenuList, 'li');

      for (var i = 0; i < subMenuListItems.length; i++) {
        // Do not fail everything if error thrown only from processing a single item
        try {
          processedSubMenuItems.push(processMenuItem(subMenuListItems[i], 2, phoneMediaQueryList, right));
        } catch (_error) {}
      }
    }
  }

  // Callback to remove added listeners when engagement ends
  var restore = function() {
    menuItem.removeEventListener(mouseOverListener);
    menuItem.removeEventListener(mouseOutListener);

    for (var i = 0; i < processedSubMenuItems.length; i++) {
      // Do not fail everything if error thrown only from restoring a single item
      try {
        processedSubMenuItems[i].restore();
      } catch (_error) {}
    }

    // Also restore styles as engagement might end while user is hovering the menu
    restoreStyles();
  };

  return {restore: restore};
};

// Search for the menu and iterate through its items to attach mouse listeners
var processMenuItems = function() {
  var menuItems = document.querySelectorAll('.sky-mega-menu > *');

  if (menuItems.length < 1) return [];
  
  // Remember all menu items to remove event listeners after engagement ends
  var processedMenuItems = [];

  // Level 1 = dropdowns opened from top menu
  // Level 2 = dropdowns opened from level 1 menu
  var level = 1;

  // Detect small screen to calculate sub-menu location
  var phoneMediaQueryList = window.matchMedia('(max-width: 767px)');

  for (var i = 0; i < menuItems.length; i++) {
    // Do not fail everything if error thrown only from processing a single item
    try {
      var menuItem = menuItems[i];
      // Needed for setting location of level 2 sub-menus
      var right = menuItem.classList.contains('right');
      processedMenuItems.push(processMenuItem(menuItem, level, phoneMediaQueryList, right));
    } catch (_error) {}
  }

  return processedMenuItems;
};

// Fetch Glia API
sm.getApi({version: 'v1'}).then(function(glia) {
  // Remember all menu items to remove event listeners after engagement ends
  var processedMenuItems = [];

  // Add custom behaviour ONLY when there's an ongoing engagement
  glia.addEventListener(glia.EVENTS.ENGAGEMENT_START, function() {
    processedMenuItems = processMenuItems();    
  });

  // Remove custom behaviour after engagement ends,
  // i.e. remove added event listeners and restore original styles
  glia.addEventListener(glia.EVENTS.ENGAGEMENT_END, function() {
    for (var i = 0; i < processedMenuItems.length; i++) {
      // Do not fail everything if error thrown from restoring a single item
      try {
        processedMenuItems[i].restore();
      } catch (_error) {}
    }
  });
});
