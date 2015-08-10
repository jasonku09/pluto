(function() {
  Polymer({
    is: "onboarding-page",
    properties: {
      challengePercentages: {
        value: [10, 18, 25]
      }
    },
    _computeNextButtonStyle: function(selectedPage, bankAccountsReady) {
      if (selectedPage === 1 && !bankAccountsReady) {
        return 'color: grey; background-color: lightgrey;';
      } else {
        return '';
      }
    },
    _computeButtonText: function(selectedPage, bankAccountsReady) {
      if (selectedPage === 0) {
        return 'LETS DO IT';
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
      this.weeklySpending = 98;
    },
    _computeBackHidden: function(selectedPage) {
      return selectedPage === 0;
    },
    _computeProgressValue: function(selectedPage) {
      return (this.selectedPage + 1) / 3 * 100;
    },
    _computeChallengeSavings: function(percentage) {
      return '$' + Math.ceil(this.weeklySpending * percentage / 100);
    },
    _getWeeklySpending: function(weeklySpending) {
      return '$' + weeklySpending;
    },
    _onBackTap: function() {
      this.selectedPage--;
    },
    _onNextTap: function() {
      this.selectedPage++;
    }
  });

}).call(this);
