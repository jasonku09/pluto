(function() {
  Polymer({
    is: "onboarding-page",
    _computeNextButtonStyle: function(selectedPage, bankAccountsReady) {
      if (selectedPage === 1 && !bankAccountsReady) {
        return 'color: grey; background-color: lightgrey;';
      } else {
        return '';
      }
    },
    _computeHeaderText: function(selectedPage) {
      if (selectedPage === 0) {
        return "PICK YOUR CHALLENGE";
      } else if (selectedPage === 1) {
        return "LINK YOUR ACCOUNTS";
      } else {
        return "SET YOUR GOAL";
      }
    },
    _computeButtonText: function(selectedPage, bankAccountsReady) {
      if (selectedPage === 0) {
        return 'NEXT';
      } else if (selectedPage === 1) {
        if (!bankAccountsReady) {
          return 'Please Wait...';
        } else {
          return 'NEXT';
        }
      } else {
        return 'CHALLENGE ACCEPTED';
      }
    },
    attached: function() {
      this.selectedPage = 0;
    },
    _computeBackHidden: function(selectedPage) {
      return selectedPage === 0;
    },
    _computeProgressValue: function(selectedPage) {
      return this.selectedPage / 2 * 100;
    },
    _onBackTap: function() {
      this.selectedPage--;
    },
    _onNextTap: function() {
      var Challenge, newACL, newChallenge, promise, startDay;
      if (this.selectedPage === 1) {
        if (!this.bankAccounts || this.bankAccounts.length === 0) {
          alert("Please link at least 1 bank account to continue");
          return;
        }
        if (!this.bankAccountsReady) {
          return;
        }
        this.$.challengeSettingsPage.CalculateWeeklyAverage();
      } else if (this.selectedPage === 2) {
        Challenge = Parse.Object.extend("Challenge");
        newChallenge = new Challenge();
        newACL = {};
        newACL[Parse.User.current().id] = {
          "read": true,
          "write": true
        };
        newChallenge.setACL(newACL);
        if (moment().weekday() === 0) {
          startDay = 7;
        } else {
          startDay = moment().weekday();
        }
        promise = newChallenge.save({
          week: new Date(moment().weekday(1)),
          max_spend: this.selectedChallenge.maxSpend,
          average_spending: this.selectedChallenge.averageSpending,
          save_percentage: this.selectedChallenge.savePercentage,
          start_day: startDay,
          userId: Parse.User.current().get('username'),
          status: 'In Progress'
        });
        promise.then((function(_this) {
          return function() {
            _this.$.confirmationDialog.open();
          };
        })(this), (function(_this) {
          return function(error) {
            console.log(error);
          };
        })(this));
        return;
      }
      this.selectedPage++;
    },
    _onConfirmClose: function() {
      this.router.go('/home');
    }
  });

}).call(this);
