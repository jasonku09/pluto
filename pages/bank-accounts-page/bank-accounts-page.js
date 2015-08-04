(function() {
  Polymer({
    is: "bank-accounts-page",
    properties: {
      bankAccounts: {
        type: Array,
        notify: true
      }
    },
    _computeAddText: function(bankData) {
      if (bankData.length === 0) {
        return "Add account";
      } else {
        return "Add another account";
      }
    },
    _computeIconColor: function(color) {
      return 'color:' + color;
    },
    _computeChartHidden: function(bankData) {
      if (bankData.length === 0) {
        return true;
      } else {
        return false;
      }
    },
    _computeTotalAssets: function(bankAccounts) {
      var account, i, len, total;
      if (!bankAccounts) {
        return;
      }
      total = 0;
      for (i = 0, len = bankAccounts.length; i < len; i++) {
        account = bankAccounts[i];
        if (account.type === 'depository') {
          total += parseInt(account.balance.current);
        } else {
          total -= parseInt(account.balance.current);
        }
      }
      return '$ ' + total;
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
    attached: function() {
      this.bankAccounts = this.bankAccounts || [];
      this._setChartData();
      this._createPlaidLink();
    },
    _formatAmount: function(amount) {
      return '$ ' + amount;
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
      var account, amount, color, i, len, name, newBankAccount, promise, ref, self, tempArray;
      if (PlutoMetadata.Environment === "Test") {
        promise = this.$.bankAccountsController.AddBankAccount(this.$.user.GetSessionToken(), token);
        self = this;
        promise.then(function() {
          self._onRefreshTap();
        });
      } else {
        amount = Math.random() * 10000;
        if (token.indexOf('chase') > -1) {
          name = "Chase";
          color = 'rgb(5, 82, 212)';
        } else if (token.indexOf('bofa') > -1) {
          name = "Bank of America";
          color = 'rgb(1, 62, 196)';
        } else if (token.indexOf('wells') > -1) {
          name = "Wells Fargo";
          color = 'rgb(185, 0, 0)';
        } else if (token.indexOf('citi') > -1) {
          name = "Citi";
        } else if (token.indexOf('us') > -1) {
          name = "US Bank";
        } else if (token.indexOf('usaa') > -1) {
          name = "USAA";
        } else if (token.indexOf('amex') > -1) {
          name = "American Express";
        }
        newBankAccount = {
          name: name,
          amount: amount.toFixed(2),
          color: color
        };
        tempArray = [];
        ref = this.bankAccounts;
        for (i = 0, len = ref.length; i < len; i++) {
          account = ref[i];
          tempArray.push(account);
        }
        tempArray.push(newBankAccount);
        this.bankAccounts = tempArray;
        this._setChartData();
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
    _setChartData: function() {
      var account, dataArray, i, len, ref;
      dataArray = [];
      ref = this.bankAccounts;
      for (i = 0, len = ref.length; i < len; i++) {
        account = ref[i];
        dataArray.push({
          label: account.name,
          value: account.amount,
          color: account.color
        });
      }
      this.bankData = dataArray;
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
