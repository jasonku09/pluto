(function() {
  Polymer({
    is: "pluto-feed-stats",
    attached: function() {
      this.totalCash = 1500;
      this.totalSaved = 780;
      this.totalSpendable = 190;
      this.saved = 0;
      this.spendable = 0;
      this.cash = 0;
      this.checkCash();
    },
    checkCash: function() {
      var check;
      check = false;
      if (this.saved < this.totalSaved) {
        this.saved += 10;
        check = true;
      }
      if (this.cash < this.totalCash) {
        this.cash += 10;
        check = true;
      }
      if (this.spendable < this.totalSpendable) {
        this.spendable += 5;
        check = true;
      }
      if (check) {
        return setTimeout(this.checkCash.bind(this, 500));
      }
    },
    incrementCash: function() {
      this.checkCash();
    }
  });

}).call(this);
