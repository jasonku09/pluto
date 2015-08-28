(function() {
  Polymer({
    is: 'challenge-details-page',
    properties: {
      challenge: {
        observer: '_onChallengeChange'
      }
    },
    attached: function() {
      this.viewTransactions = false;
    },
    _computeProgressHidden: function(selectedTab) {
      return selectedTab !== 'progress';
    },
    _computeInsightsHidden: function(selectedTab) {
      return selectedTab !== 'insights';
    },
    _computeTransactionsHidden: function(selectedTab) {
      if (selectedTab === 'transactions') {
        this.$.transactionsList.transactionsFilter = 'food';
        return false;
      } else {
        return true;
      }
    },
    _computeDayCounter: function(challenge) {
      var currentDay, totalDays, weekday;
      if (!this.challenge) {
        return;
      }
      if (moment().isAfter(moment(challenge.week).weekday(7))) {
        return 'Completed';
      }
      totalDays = 8 - challenge.startDay;
      if (totalDays === 8) {
        totalDays = 1;
      }
      if (moment().weekday() === 0) {
        weekday = 7;
      } else {
        weekday = moment().weekday();
      }
      currentDay = weekday - challenge.startDay + 1;
      return "Day " + currentDay + " / " + totalDays;
    },
    _computeSavedText: function(challenge) {
      if (!this.challenge) {
        return;
      }
      if (moment().isAfter(moment(challenge.week).weekday(7))) {
        return 'saved';
      } else {
        return 'left to spend';
      }
    },
    _computeSpendable: function(spent) {
      var amount;
      if (!spent) {
        return;
      }
      if (this.challenge.status === 'Completed') {
        amount = this.challenge.averageSpend - spent;
        if (amount < 0) {
          amount = 0;
        }
      } else if (this.challenge.maxSpend - spent < 0) {
        amount = 0;
      } else {
        amount = this.challenge.maxSpend - spent;
      }
      return amount.toFixed(2);
    },
    _onChallengeChange: function() {
      var challengeEnd, challengeStart, week;
      if (!this.challenge) {
        return;
      }
      week = this.challenge.week;
      challengeStart = moment(week).weekday(this.challenge.startDay);
      challengeEnd = moment(week).weekday(7);
      this.$.transactionsList.GetTransactions(challengeStart, challengeEnd).then((function(_this) {
        return function() {
          _this.selectedTab = 'progress';
          return _this.fire('ready');
        };
      })(this));
    }
  });

}).call(this);
