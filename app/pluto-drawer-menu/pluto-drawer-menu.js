(function() {
  Polymer({
    is: "pluto-drawer-menu",
    properties: {
      user: {
        type: Object
      }
    },
    attached: function() {
      return this.parentNode.style.backgroundColor = 'rgba(0,0,0,0)';
    },
    _onUserReturn: function() {},
    _onLogoutTap: function() {
      Parse.User.logOut();
      this.router.go('/login');
    }
  });

}).call(this);
