(function() {
  Polymer({
    is: 'challenges-page',
    attached: function() {
      this._GetChallenges();
      this.selectedTab = 'active';
      this.selectedChallenge = null;
      this.loading = false;
    },
    _formatDate: function(challenge) {
      if (!challenge) {
        return;
      }
      return challenge.week.format('MMMM ') + moment(challenge.week).weekday(challenge.startDay).format('D - ') + moment(challenge.week).weekday(7).format('D, ') + challenge.week.format('YYYY');
    },
    _computeMainHidden: function(selectedChallenge, loading) {
      return selectedChallenge !== null || loading;
    },
    _computeDetailsHidden: function(selectedChallenge, loading) {
      return selectedChallenge === null || loading;
    },
    _computeChallenges: function(challenges, selectedTab) {
      var challenge, filter, filtered, i, len;
      filtered = [];
      filter = selectedTab === 'active' ? 'In Progress' : 'Completed';
      for (i = 0, len = challenges.length; i < len; i++) {
        challenge = challenges[i];
        if (challenge.status === filter) {
          filtered.push(challenge);
        }
      }
      return filtered;
    },
    _computeDayCounter: function(challenge) {
      var currentDay, totalDays, weekday;
      if (!challenge) {
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
    _onChallengeTap: function(e) {
      var target;
      target = e.target;
      while (target !== this && !target._templateInstance) {
        target = target.parentNode;
      }
      this.selectedChallenge = this.$.challengeRepeat.itemForElement(target);
      this.loading = true;
    },
    _onDetailsReady: function() {
      return this.loading = false;
    },
    _onBackTap: function() {
      return this.selectedChallenge = null;
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
    }
  });

}).call(this);
