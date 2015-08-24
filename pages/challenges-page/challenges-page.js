(function() {
  Polymer({
    is: 'challenges-page',
    properties: {
      currentChallenge: {
        observer: '_onChallengeChange'
      }
    },
    attached: function() {
      this._GetChallenges();
      this.viewTransactions = false;
    },
    _formatDate: function(challenge) {
      return challenge.week.format('MMMM ') + moment(challenge.week).weekday(challenge.startDay).format('D - ') + moment(challenge.week).weekday(7).format('D, ') + challenge.week.format('YYYY');
    },
    _computePreviousArrowStyle: function(index) {
      if (index === (this.challenges.length - 1)) {
        return 'color: lightgrey';
      } else {
        return 'color: grey';
      }
    },
    _computeNextArrowStyle: function(index) {
      if (index === 0) {
        return 'color: lightgrey';
      } else {
        return 'color: grey';
      }
    },
    _computeDayCounter: function(challenge) {
      var currentDay, totalDays, weekday;
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
      if (moment().isAfter(moment(challenge.week).weekday(7))) {
        return 'saved';
      } else {
        return 'left to spend';
      }
    },
    _calculateSpendable: function(spent) {
      var amount;
      if (!spent) {
        return;
      }
      if (this.currentChallenge.status === 'Completed') {
        amount = this.currentChallenge.averageSpend - spent;
        if (amount < 0) {
          amount = 0;
        }
        return amount.toFixed(2);
      } else if (this.currentChallenge.maxSpend - spent < 0) {
        return 0;
      } else {
        return this.currentChallenge.maxSpend - spent;
      }
    },
    _GetChallenges: function() {
      var Challenge, promise, query;
      Challenge = Parse.Object.extend("Challenge");
      query = new Parse.Query(Challenge);
      query.equalTo('userId', Parse.User.current().get('username'));
      query.descending('week');
      promise = query.find();
      return promise.then((function(_this) {
        return function(challenges) {
          _this._parseChallenges(challenges);
          _this.currentChallengeIndex = 0;
          _this.currentChallenge = _this.challenges[_this.currentChallengeIndex];
          if (_this.currentChallenge.status === "Completed") {
            _this.$.newChallengeDialog.open();
          }
        };
      })(this));
    },
    _parseChallenges: function(challenges) {
      var challenge, i, len, temp;
      temp = [];
      for (i = 0, len = challenges.length; i < len; i++) {
        challenge = challenges[i];
        if (moment().isAfter(moment(challenge.attributes.week).add(6, 'days'), 'day')) {
          challenge.set('status', 'Completed');
          challenge.save();
        }
        temp.push({
          maxSpend: Math.floor(challenge.attributes.max_spend),
          week: moment(challenge.attributes.week),
          startDay: challenge.attributes.start_day,
          averageSpend: challenge.attributes.average_spending,
          savePercentage: challenge.attributes.save_percentage,
          status: challenge.attributes.status
        });
      }
      this.challenges = temp;
    },
    _onChallengeChange: function() {
      var challengeEnd, challengeStart, week;
      week = this.currentChallenge.week;
      challengeStart = moment(week).weekday(this.currentChallenge.startDay);
      challengeEnd = moment(week).weekday(7);
      this.$.transactionsList.GetTransactions(challengeStart, challengeEnd);
    },
    _onBackTap: function() {
      this.viewTransactions = false;
    },
    _ViewTransactions: function() {
      this.viewTransactions = true;
      this.$.transactionsList.transactionsFilter = 'food';
    },
    _onChangeSuccess: function() {
      this.$.successToast.show();
    },
    _CreateNewChallenge: function() {
      var promise;
      promise = this.$.transactionsParser.CalculateWeeklyAverage(moment().weekday(), 'Food and Drink');
      return promise.then((function(_this) {
        return function(average) {
          var maxSpend, savePercentage, weeklySpending;
          savePercentage = _this.challenges[0].savePercentage;
          weeklySpending = Math.round(average.reduce(function(a, b) {
            return a + b;
          }) / average.length * 100) / 100;
          maxSpend = Math.round((weeklySpending - (savePercentage * weeklySpending / 100)) * 100) / 100;
          _this.$.challengesController.CreateNewChallenge(maxSpend, weeklySpending, savePercentage).then(function() {
            _this.$.newChallengeDialog.close();
            return _this._GetChallenges();
          });
        };
      })(this));
    },
    _viewPreviousChallenge: function() {
      if (this.currentChallengeIndex === (this.challenges.length - 1)) {
        return;
      }
      this.currentChallengeIndex++;
      this.currentChallenge = this.challenges[this.currentChallengeIndex];
    },
    _viewNextChallenge: function() {
      if (this.currentChallengeIndex === 0) {
        return;
      }
      this.currentChallengeIndex--;
      this.currentChallenge = this.challenges[this.currentChallengeIndex];
    }
  });

}).call(this);
