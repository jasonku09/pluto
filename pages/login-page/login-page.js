(function() {
  Polymer({
    is: "login-page",
    _computeSignupHidden: function(tab) {
      return tab === 'Login';
    },
    attached: function() {
      this.selectedTab = "Login";
      this.loading = false;
      this.error = false;
    },
    _onButtonTap: function() {
      if (!this._ValidateInputs()) {
        return;
      }
      if (this.selectedTab === 'Login') {
        this._Login();
      } else {
        this._Signup();
      }
    },
    _Login: function() {
      var promise;
      this.loadingLabel = "Logging in";
      this.loading = true;
      promise = Parse.User.logIn(this.email, this.password);
      promise.then((function(_this) {
        return function(success) {
          return _this._onSignupSuccess();
        };
      })(this), this._onError.bind(this));
    },
    _Signup: function() {
      var promise, user;
      if (!this._ValidateInputs()) {
        return;
      }
      this.loadingLabel = "Creating Account";
      this.loading = true;
      user = new Parse.User();
      user.set("email", this.email);
      user.set("username", this.email);
      user.set("password", this.password);
      user.set("nickname", this.name);
      promise = user.signUp(null);
      promise.then((function(_this) {
        return function(success) {
          return _this.$.signupConfirmationDialog.open();
        };
      })(this), this._onError.bind(this));
    },
    _onCancelTap: function() {
      this.signup = false;
    },
    _ValidateInputs: function() {
      var i, input, inputs, len;
      inputs = [this.$.emailInput, this.$.passwordInput];
      if (this.selectedTab === 'Signup') {
        inputs.push(this.$.nameInput);
        if (this.password !== this.passwordConfirm) {
          this.error = true;
          this.errorMessage = "Oops, passwords do not match";
          return;
        }
        inputs.push(this.$.passwordInputConfirm);
      }
      for (i = 0, len = inputs.length; i < len; i++) {
        input = inputs[i];
        if (input.value.length === 0) {
          input.invalid = true;
        }
        input.validate();
        if (input.invalid) {
          return false;
        }
      }
      return true;
    },
    _onSignupSuccess: function() {
      var Challenge, query;
      Challenge = Parse.Object.extend("Challenge");
      query = new Parse.Query(Challenge);
      query.equalTo('userId', Parse.User.current().get('username'));
      query.first().then((function(_this) {
        return function(challenge) {
          if (!challenge) {
            return _this.router.go("/onboarding");
          } else {
            return _this.router.go("/home");
          }
        };
      })(this));
    },
    _onError: function(error) {
      switch (error.code) {
        case 100:
          this.errorMessage = "Connection to servers failed, please try again later";
          break;
        case 101:
          this.errorMessage = "Incorrect username or password";
          break;
        case 202:
          this.errorMessage = "An account with that email already exists";
          break;
        case 203:
          this.errorMessage = "An account with that email already exists";
      }
      this.loading = false;
      this.error = true;
    }
  });

}).call(this);
