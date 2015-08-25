(function() {
  Polymer({
    is: "onboarding-page",
    _computeCalculatingText: function(calculating) {
      if (calculating) {
        return "Calculating your average weekly spend on Food and Drink";
      } else {
        return "Your weekly average spend on Food and Drinks is";
      }
    },
    _computeNextButtonStyle: function(selectedPage, bankAccountsReady) {
      if (selectedPage === 4 && !bankAccountsReady) {
        return 'color: grey; background-color: lightgrey;';
      } else {
        return '';
      }
    },
    _computeHeaderText: function(selectedPage) {
      switch (selectedPage) {
        case 0:
          return "WELCOME";
        case 1:
          return "WHAT IS YOUR GOAL?";
        case 2:
          return "WHAT IS YOUR GOAL?";
        case 3:
          return "WHAT IS YOUR GOAL?";
        case 4:
          return "LINK YOUR ACCOUNTS";
        case 5:
          return "PICK YOUR CHALLENGE";
        case 6:
          return "CHALLENGE DETAIL";
      }
    },
    _computeButtonText: function(selectedPage, bankAccountsReady) {
      switch (selectedPage) {
        case 0:
          return "OKAY";
        case 1:
          return "NEXT";
        case 2:
          return "NEXT";
        case 3:
          return "SOUNDS GOOD";
        case 4:
          if (!bankAccountsReady) {
            return 'Please Wait...';
          } else {
            return 'NEXT';
          }
          break;
        case 5:
          return 'SELECT';
        case 6:
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
      return this.selectedPage / 6 * 100;
    },
    _onBackTap: function() {
      this.selectedPage--;
    },
    _onNextTap: function() {
      var promise;
      if (this.selectedPage === 5) {
        this.$.calculateDialog.open();
        this.calculating = true;
        this._CalculateAverage('Food and Drink');
        return;
      } else if (this.selectedPage === 6) {
        promise = this.$.challengesController.CreateNewChallenge(this.selectedChallenge.maxSpend, this.selectedChallenge.averageSpending, this.selectedChallenge.savePercentage);
        this.$.creatingDialog.open();
        promise.then((function(_this) {
          return function() {
            return _this.$.challengesController.CreateNewGoal(_this.goalItem, _this.goalAmount).then(function() {
              _this.$.creatingDialog.close();
              _this.$.confirmationDialog.open();
            });
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
    _onOkayTap: function() {
      this.$.calculateDialog.close();
      this.selectedPage++;
    },
    _CalculateAverage: function(category) {
      var promise;
      promise = this.$.transactionsParser.CalculateWeeklyAverage(moment().weekday(), category);
      promise.then((function(_this) {
        return function(average) {
          _this.weeklySpending = average;
          _this.calculating = false;
        };
      })(this));
    },
    _onConfirmClose: function() {
      this.router.go('/home');
    }
  });

}).call(this);
