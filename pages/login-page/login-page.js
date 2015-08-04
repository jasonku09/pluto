(function() {
  Polymer({
    is: "login-page",
    properties: {
      signup: {
        observer: '_onSignupChange'
      },
      loading: {
        observer: '_onLoadingChange'
      }
    },
    attached: function() {
      this.signup = false;
      this.loading = false;
      this.error = false;
    },
    _onLoginTap: function() {
      var promise;
      if (!this._ValidateInputs()) {
        return;
      }
      this.loadingLabel = "Logging in";
      this.loading = true;
      promise = Parse.User.logIn(this.email, this.password);
      promise.then(this._onLoginSuccess.bind(this), this._onError.bind(this));
    },
    _onSignupTap: function() {
      var promise, user;
      if (!this.signup) {
        this.signup = true;
        return;
      } else {
        if (!this._ValidateInputs()) {
          return;
        }
        this.loadingLabel = "Creating Account";
        this.loading = true;
        user = new Parse.User();
        user.set("email", this.email);
        user.set("username", this.email);
        user.set("password", this.password);
        user.set("nickname", this.username);
        promise = user.signUp(null);
        promise.then(this._onSignupSuccess.bind(this), this._onError.bind(this));
      }
    },
    _onCancelTap: function() {
      this.signup = false;
    },
    _ValidateInputs: function() {
      var i, input, inputs, len;
      inputs = [this.$.emailInput, this.$.passwordInput];
      if (this.signup) {
        inputs.push(this.$.usernameInput);
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
      this.router.go("/home");
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
    },
    _onLoginSuccess: function() {
      this.router.go("/home");
    },
    _onSignupChange: function() {
      this.loginError = false;
      if (this.signup) {
        this.$.signupCollapse.opened = true;
        this.$.container.style.opacity = 1;
      } else {
        this.$.signupCollapse.opened = false;
        this.$.container.style.opacity = 0;
      }
    },
    _onLoadingChange: function() {
      if (this.loading) {
        this.$.inputContainer.classList.add('hide');
        this.$.buttonContainer.classList.add('hide');
        this.$.loadingIndicator.classList.add('show');
      } else {
        this.$.inputContainer.classList.remove('hide');
        this.$.buttonContainer.classList.remove('hide');
        this.$.loadingIndicator.classList.remove('show');
      }
    }
  });

}).call(this);
