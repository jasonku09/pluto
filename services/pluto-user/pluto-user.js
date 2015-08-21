(function() {
  var User, user;

  User = (function() {
    function User() {}

    User.prototype.loggedIn = false;

    User.prototype.userId = '';

    User.prototype.sessionToken = '';

    User.prototype.onboarded = false;

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
      var currentUser, promise;
      currentUser = Parse.User.current();
      if (currentUser === null) {
        this.fire('ready');
      } else {
        user.loggedIn = true;
        this.UpdateUser();
        promise = this._CheckOnboarded();
        promise.then((function(_this) {
          return function(challenge) {
            if (!challenge) {
              user.onboarded = false;
            } else {
              user.onboarded = true;
            }
            return _this.fire('ready');
          };
        })(this));
      }
    },
    UpdateUser: function() {
      user.userId = Parse.User.current().get('username');
      user.sessionToken = Parse.User.current()._sessionToken;
    },
    _CheckOnboarded: function() {
      var Challenge, query;
      Challenge = Parse.Object.extend("Challenge");
      query = new Parse.Query(Challenge);
      query.equalTo('userId', user.userId);
      return query.first();
    },
    IsOnboarded: function() {
      return user.onboarded;
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
