(function() {
  Polymer({
    is: "home-page",
    attached: function() {
      var currentUser, user;
      currentUser = Parse.User.current();
      user = {};
      user.name = currentUser.get('fullname');
      user.email = currentUser.get('email');
      user.username = currentUser.get('username');
      this.user = user;
    },
    _onMenuItemSelected: function() {
      this.$.drawerPanel.closeDrawer();
    }
  });

}).call(this);
