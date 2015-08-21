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
    _computeDayCounter: function(challenge) {
      var currentDay, totalDays;
      if (moment().isAfter(moment(challenge.week).weekday(7))) {
        return 'Completed';
      }
      totalDays = 8 - challenge.startDay;
      if (totalDays === 8) {
        totalDays = 1;
      }
      currentDay = moment().weekday() - challenge.startDay + 1;
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
      if (this.currentChallenge.maxSpend - spent < 0) {
        return 0;
      } else {
        return this.currentChallenge.maxSpend - spent;
      }
    },
    _GetChallenges: function() {
      var Challenge, promise, query;
      Challenge = Parse.Object.extend("Challenge");
      query = new Parse.Query(Challenge);
      query.equalTo('userId', this.$.user.GetUserId());
      query.descending('timestamp');
      promise = query.find();
      return promise.then((function(_this) {
        return function(challenges) {
          _this._parseChallenges(challenges);
          _this.currentChallenge = _this.challenges[0];
        };
      })(this));
    },
    _parseChallenges: function(challenges) {
      var challenge, i, len, temp;
      temp = [];
      for (i = 0, len = challenges.length; i < len; i++) {
        challenge = challenges[i];
        temp.push({
          maxSpend: Math.floor(challenge.attributes.max_spend),
          week: moment(challenge.attributes.week),
          startDay: challenge.attributes.start_day
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
    }
  });

}).call(this);
