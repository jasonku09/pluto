(function() {
  Polymer({
    is: "bank-accounts-page",
    properties: {
      bankAccounts: {
        type: Array,
        notify: true
      },
      ready: {
        notify: true
      }
    },
    _computeLoaderHidden: function(parseTimeRemaining, parseFinish) {
      return !moment().isBefore(this.parseFinish);
    },
    _computeProgressValue: function(parseTimeRemaining) {
      return (moment.duration(5, 'minutes').asSeconds() - parseTimeRemaining) / moment.duration(5, 'minutes').asSeconds() * 100;
    },
    _computeAddText: function(bankAccounts) {
      if (!bankAccounts || bankAccounts.length === 0) {
        return "Add account";
      } else {
        return "Add another account";
      }
    },
    _getCashAccounts: function(bankAccounts) {
      var account, cashAccounts, i, len;
      if (!bankAccounts) {
        return;
      }
      cashAccounts = [];
      for (i = 0, len = bankAccounts.length; i < len; i++) {
        account = bankAccounts[i];
        if (account.type === "depository") {
          cashAccounts.push(account);
        }
      }
      return cashAccounts;
    },
    _getCreditAccounts: function(bankAccounts) {
      var account, creditAccounts, i, len;
      if (!bankAccounts) {
        return;
      }
      creditAccounts = [];
      for (i = 0, len = bankAccounts.length; i < len; i++) {
        account = bankAccounts[i];
        if (account.type === "credit") {
          creditAccounts.push(account);
        }
      }
      return creditAccounts;
    },
    _getAccountName: function(account) {
      return account.meta.name + " (" + account.meta.number + ")";
    },
    _getAccountBalance: function(account) {
      return '$' + account.balance.current;
    },
    _formatAmount: function(amount) {
      return '$ ' + amount;
    },
    attached: function() {
      this.ready = false;
      this._createPlaidLink();
      this._timer();
      this.bankAccounts = this.bankAccounts || [];
      if (this.bankAccounts.length > 0 && moment().isAfter(this.parseFinish)) {
        this.ready = true;
      }
    },
    _onRefreshTap: function() {
      var banksPromise, self;
      banksPromise = this.$.bankAccountsController.GetBankAccounts(this.$.user.GetSessionToken());
      self = this;
      banksPromise.then(function(banks) {
        var account, bank, bankaccounts, i, j, len, len1, ref;
        bankaccounts = [];
        for (i = 0, len = banks.length; i < len; i++) {
          bank = banks[i];
          ref = bank.accounts;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            account = ref[j];
            bankaccounts.push(account);
          }
        }
        self.bankAccounts = bankaccounts;
        self.$.bankAccountsStorage.save();
      }, function(error) {
        console.log(error);
      });
    },
    _addBankAccount: function(token) {
      var promise, self;
      if (PlutoMetadata.Environment === "Test") {
        promise = this.$.bankAccountsController.AddBankAccount(this.$.user.GetSessionToken(), token);
        self = this;
        promise.then(function() {
          self._startParseTimer();
          self._onRefreshTap();
        });
      }
    },
    _createPlaidLink: function() {
      var environment, key;
      environment = '';
      key = '';
      switch (PlutoMetadata.Environment) {
        case "Dev":
          environment = "tartan";
          key = "test_key";
          break;
        case "Test":
          environment = "tartan";
          key = "20f7a7d661059ee02a9f9825c7767a";
          break;
        case "Production":
          environment = "production";
          key = "20f7a7d661059ee02a9f9825c7767a";
      }
      return this.PlaidLink = Plaid.create({
        env: environment,
        clientName: "Pluto",
        key: key,
        product: "connect",
        onSuccess: (function(_this) {
          return function(token) {
            _this._addBankAccount(token);
            _this._createPlaidLink();
          };
        })(this)
      });
    },
    _startParseTimer: function() {
      this.ready = false;
      this.parseFinish = moment().add(5, 'minutes');
      this._timer();
    },
    _timer: function() {
      return setTimeout((function(_this) {
        return function() {
          _this.parseTimeRemaining = moment(_this.parseFinish).diff(moment(), 'seconds');
          if (_this.parseTimeRemaining < 0) {
            _this.ready = true;
            return;
          }
          _this._timer();
        };
      })(this), 1000);
    },
    _onAddTap: function() {
      this.PlaidLink.open();
    },
    _onBackTap: function() {
      return this.router.go('/home', {
        data: {
          accounts: this.bankAccounts
        }
      });
    }
  });

}).call(this);
