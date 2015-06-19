(function() {
  Polymer({
    is: 'random-user-generator',
    properties: {
      users: {
        type: Array,
        notify: true
      },
      numberRequested: {
        type: Number
      }
    },
    attached: function() {
      var _i, _ref;
      this.users = [];
      for (_i = 1, _ref = this.numberRequested; 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--) {
        this.$.userAjax.generateRequest();
      }
    },
    _handleResponse: function(response) {
      this.push('users', this.lastUser.results[0].user);
      if (this.users.length === this.numberRequested) {
        this.fire('complete');
      }
    }
  });

}).call(this);
