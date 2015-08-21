(function() {
  Polymer({
    is: 'challenge-settings-page',
    properties: {
      selectedChallenge: {
        type: Object,
        notify: true
      }
    },
    attached: function() {
      this.weekSpan = moment().format('ddd') + ' - Sun ';
      this.selectedPercentage = null;
    },
    _computeItemStyle: function(selectedPercentage, percentage) {
      if (percentage === selectedPercentage) {
        return 'color: #9ad7db; border-color: #9ad7db';
      } else {
        return '';
      }
    },
    _computeChallengeSavings: function(percentage) {
      return '$' + Math.ceil(this.weeklySpending * percentage / 100);
    },
    _computeQuestionHidden: function(selectedPercentage) {
      return selectedPercentage !== null;
    },
    _computeInfoHidden: function(selectedPercentage) {
      return selectedPercentage === null;
    },
    _dollarize: function(amount) {
      return '$' + amount;
    },
    _onPercentageTap: function(e) {
      var target;
      target = e.target;
      while (target !== this && !target._templateInstance) {
        target = target.parentNode;
      }
      this.selectedPercentage = this.$.percentageRepeat.itemForElement(target);
      this.maxSpend = Math.round((this.weeklySpending - (this.selectedPercentage * this.weeklySpending / 100)) * 100) / 100;
      this.saveAmount = Math.round(this.weeklySpending * this.selectedPercentage) / 100;
      this.selectedChallenge = {
        maxSpend: this.maxSpend,
        savePercentage: this.selectedPercentage,
        averageSpending: this.weeklySpending
      };
    },
    CalculateWeeklyAverage: function() {
      var promise;
      this.parsing = true;
      promise = this.$.transactionsParser.CalculateWeeklyAverage(moment().weekday(), 'Food and Drink');
      promise.then((function(_this) {
        return function(average) {
          _this.parsing = false;
          _this.weeklySpending = Math.round(average.reduce(function(a, b) {
            return a + b;
          }) / average.length * 100) / 100;
          _this.challengePercentages = [10, 20, 30];
        };
      })(this), (function(_this) {
        return function(error) {
          _this.parsing = false;
          _this.weeklySpending = 100;
          return console.log(error);
        };
      })(this));
    }
  });

}).call(this);
