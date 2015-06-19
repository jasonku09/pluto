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
    _onUserReturn: function() {
      return this.user = this.users[0];
    }
  });

}).call(this);
