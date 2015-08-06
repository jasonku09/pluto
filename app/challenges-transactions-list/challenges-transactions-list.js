(function() {
  Polymer({
    is: 'challenges-transactions-list',
    properties: {
      transactionsFilter: {
        type: String,
        observer: '_onFilterChange'
      }
    },
    attached: function() {
      var promise;
      this.transactionsController = this.$.transactionsController;
      this.transactionsParser = this.$.transactionsParser;
      promise = this.transactionsController.GetTransactions(null, moment().weekday(1).subtract(14, 'days'), moment().weekday(7).subtract(14, 'days'));
      promise.then((function(_this) {
        return function(transactions) {
          _this.transactions = _this.transactionsParser.Parse(transactions);
          return _this.FilterTransactions();
        };
      })(this), function(error) {
        return alert(error);
      });
      this.transactionsFilter = 'food';
    },
    FilterTransactions: function() {
      var food, i, len, other, ref, transaction;
      if (!this.transactions) {
        return;
      }
      food = [];
      other = [];
      ref = this.transactions;
      for (i = 0, len = ref.length; i < len; i++) {
        transaction = ref[i];
        if (transaction.category.indexOf('Food and Drink') > -1) {
          food.push(transaction);
        } else {
          other.push(transaction);
        }
      }
      if (this.transactionsFilter === 'food') {
        this.filteredTransactions = food;
      } else {
        this.filteredTransactions = other;
      }
    },
    _onFilterChange: function() {
      var i, item, len, transactionItems;
      transactionItems = document.querySelectorAll('transaction-item');
      for (i = 0, len = transactionItems.length; i < len; i++) {
        item = transactionItems[i];
        item.Close();
      }
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
    _onOtherTap: function() {
      this.transactionsFilter = 'all';
    },
    _onCategoryChange: function(e) {
      var i, len, promise, ref, self, transaction;
      ref = this.transactions;
      for (i = 0, len = ref.length; i < len; i++) {
        transaction = ref[i];
        if (transaction.objectId === e.detail.objectId) {
          transaction.category = e.detail.newCategory;
        }
      }
      promise = this.transactionsController.UpdateCategory(e.detail.objectId, e.detail.newCategory);
      self = this;
      promise.then(function(success) {
        self.FilterTransactions();
        return self.fire('change-success');
      });
    }
  });

}).call(this);
