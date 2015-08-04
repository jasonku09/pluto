(function() {
  var User, user;

  User = (function() {
    function User() {}

    User.prototype.loggedIn = false;

    User.prototype.userId = '';

    User.prototype.sessionToken = '';

    return User;

  })();

  user = user || new User();

  Polymer({
    is: 'pluto-user',
    attached: function() {
      Parse.initialize(PlutoMetadata.Parse.ClientID, PlutoMetadata.Parse.Secret);
      if (!user.initialized) {
        this._Initialize();
      } else {
        this.fire('ready');
      }
    },
    _Initialize: function() {
      var currentUser;
      currentUser = Parse.User.current();
      if (currentUser === null) {
        this.fire('ready');
      } else {
        user.loggedIn = true;
        this.UpdateUser();
        this.fire('ready');
      }
    },
    UpdateUser: function() {
      user.userId = Parse.User.current().get('username');
      user.sessionToken = Parse.User.current()._sessionToken;
    },
    IsLoggedIn: function() {
      return user.loggedIn;
    },
    GetUserId: function() {
      return user.userId;
    },
    GetSessionToken: function() {
      return user.sessionToken;
    }
  });

}).call(this);
