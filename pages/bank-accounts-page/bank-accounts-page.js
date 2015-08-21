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
    _computeHeaderHidden: function(bankAccounts) {
      if (!bankAccounts) {
        return false;
      }
      return true;
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
      this._getBankAccounts();
      this.bankAccounts = this.bankAccounts || [];
    },
    _getBankAccounts: function() {
      var banksPromise, self;
      banksPromise = this.$.bankAccountsController.GetBankAccounts(Parse.User.current()._sessionToken);
      self = this;
      banksPromise.then(function(banks) {
        var account, bank, bankaccounts, i, j, len, len1, ref;
        bankaccounts = [];
        for (i = 0, len = banks.length; i < len; i++) {
          bank = banks[i];
          ref = bank.accounts;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            account = ref[j];
            switch (account.institution_type) {
              case "amex":
                account.icon = "../../resources/icons/amex.png";
                break;
              case "bofa":
                account.icon = "../../resources/icons/bofa.png";
                break;
              case "chase":
                account.icon = "../../resources/icons/chase.png";
                break;
              case "citi":
                account.icon = "../../resources/icons/citi.jpg";
                break;
              case "usaa":
                account.icon = "../../resources/icons/usaa.jpg";
                break;
              case "us":
                account.icon = "../../resources/icons/usbank.png";
                break;
              case "wells":
                account.icon = "../../resources/icons/wellsfargo.jpg.png";
            }
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
      var promise;
      promise = this.$.bankAccountsController.AddBankAccount(Parse.User.current()._sessionToken, token);
      return promise.then((function(_this) {
        return function() {
          _this.transactionsUpdating = _this.transactionsUpdating + 1 || 1;
          _this._startParseTimer();
          _this._getBankAccounts();
        };
      })(this));
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
          environment = "tartan";
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
      setTimeout((function(_this) {
        return function() {
          var promise;
          _this.parseTimeRemaining = moment(_this.parseFinish).diff(moment(), 'seconds') || 0;
          if (_this.parseTimeRemaining <= 0) {
            if (_this.transactionsUpdating > 0) {
              alert("Updating Transactions...");
              promise = _this.$.transactionsController.UpdateTransactions(Parse.User.current()._sessionToken);
              promise.then(function() {
                _this.transactionsUpdating--;
                if (_this.transactionsUpdating === 0) {
                  _this.ready = true;
                }
              }, function(error) {
                _this.transactionsUpdating--;
                if (_this.transactionsUpdating === 0) {
                  setTimeout(function() {
                    return _this.ready = true;
                  }, 60000);
                }
              });
            } else {
              _this.ready = true;
            }
            return;
          }
          _this._timer();
        };
      })(this), 1000);
    },
    _updateTransactions: function() {
      var promise;
      promise = this.$.transactionsController.UpdateTransactions(Parse.User.current()._sessionToken);
      return promise.then(function() {
        return alert('success');
      }, function(error) {
        return alert('error' + error);
      });
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
