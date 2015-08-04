(function() {
  Polymer({
    is: 'challenges-page',
    properties: {
      transactionsFilter: {
        type: String,
        observer: '_onFilterChange'
      }
    },
    attached: function() {
      var promise, self;
      this.transactionsController = this.$.transactionsController;
      promise = this.transactionsController.GetTransactions(moment().weekday(1).subtract(14, 'days'), moment().weekday(7).subtract(14, 'days'));
      self = this;
      promise.then(function(transactions) {
        return self._ParseTransactions(transactions);
      }, function(error) {
        return alert(error);
      });
      this.transactionsFilter = 'food';
    },
    _ParseTransactions: function(transactions) {
      var i, len, temp, transaction;
      temp = [];
      for (i = 0, len = transactions.length; i < len; i++) {
        transaction = transactions[i];
        transaction.attributes.timestamp = moment(transaction.attributes.timestamp).format('M / D');
        transaction.attributes.category = transaction.attributes.category || ["UNCATEGORIZED"];
        temp.push(transaction.attributes);
      }
      this.transactions = temp;
      this.FilterTransactions();
    },
    FilterTransactions: function() {
      var i, len, ref, temp, transaction;
      if (!this.transactions) {
        return;
      }
      if (this.transactionsFilter === 'food') {
        temp = [];
        ref = this.transactions;
        for (i = 0, len = ref.length; i < len; i++) {
          transaction = ref[i];
          if (transaction.category.indexOf('Food and Drink') > -1) {
            temp.push(transaction);
          }
        }
        this.filteredTransactions = temp;
      } else {
        this.filteredTransactions = this.transactions;
      }
    },
    _onFilterChange: function() {
      if (this.transactionsFilter === 'food') {
        this.$.allButton.classList.remove('active');
        this.$.foodButton.classList.add('active');
      } else {
        this.$.allButton.classList.add('active');
        this.$.foodButton.classList.remove('active');
      }
      this.FilterTransactions();
    },
    _onFoodTap: function() {
      this.transactionsFilter = 'food';
    },
    _onAllTap: function() {
      this.transactionsFilter = 'all';
    }
  });

}).call(this);
