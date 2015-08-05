(function() {
  Polymer({
    is: 'challenges-page',
    _onChangeSuccess: function() {
      this.$.successToast.show();
    }
  });

}).call(this);
