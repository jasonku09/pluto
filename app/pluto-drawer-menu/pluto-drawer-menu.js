(function() {
  Polymer({
    is: "pluto-drawer-menu",
    properties: {
      user: {
        type: Object
      },
      menuItems: {
        value: [
          {
            name: 'Challenges',
            value: 'challenges'
          }, {
            name: 'Bank Accounts',
            value: 'accounts'
          }, {
            name: 'Settings',
            value: 'settings'
          }
        ]
      }
    },
    attached: function() {
      this.parentNode.style.backgroundColor = 'rgba(0,0,0,0)';
      this.router.go('/onboarding');
    },
    _onLogoutTap: function() {
      Parse.User.logOut();
      this.router.go('/login');
      this.fire('item-selected');
    },
    _onMenuItemTap: function(e) {
      var item;
      item = this.$.menuRepeat.itemForElement(e.target);
      this.router.go('/' + item.value);
      this.fire('item-selected');
    }
  });

}).call(this);
