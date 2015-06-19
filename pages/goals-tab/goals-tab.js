(function() {
  Polymer({
    is: "goals-tab",
    _onItemClick: function() {
      this.$.pages.selected = 1;
    },
    _onClose: function() {
      return this.$.pages.selected = 0;
    }
  });

}).call(this);
