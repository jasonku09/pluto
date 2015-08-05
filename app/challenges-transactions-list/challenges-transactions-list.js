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
        transaction.attributes.objectId = transaction.id;
        temp.push(transaction.attributes);
      }
      this.transactions = temp;
      this.FilterTransactions();
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
