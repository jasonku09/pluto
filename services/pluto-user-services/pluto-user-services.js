(function() {
  Polymer({
    is: "pluto-user-services",
    properties: {
      user: {
        type: Object
      }
    },
    attached: function() {
      this.clientID = "test_id";
      return this.secret = "test_secret";
    },
    AddAccount: function(publicToken) {
      var promise;
      promise = this.controller.ExchangeToken(publicToken);
      return promise.then(function(result) {
        return alert(result);
      }, (function(_this) {
        return function(error) {
          return alert(error);
        };
      })(this));
    },
    _onAddAccountSuccess: function() {
      var BankAccounts, query;
      BankAccounts = Parse.Object.extend("BankAccounts");
      query = new Parse.Query(BankAccounts);
      query.equalTo("user", this.user);
      return query.find({
        success: function(result) {
          return result.accounts;
        }
      }, {
        error: (function(_this) {
          return function(error) {
            return error.message;
          };
        })(this)
      });
    }
  });

}).call(this);
