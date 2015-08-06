(function() {
  Polymer({
    is: 'challenges-page',
    attached: function() {
      var test;
      test = this.$.transactionsParser.CalculateWeeklyAverage(3, "Food and Drink");
      console.log(test);
    },
    _onChangeSuccess: function() {
      this.$.successToast.show();
    }
  });

}).call(this);
