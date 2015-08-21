(function() {
  Polymer({
    is: 'challenges-transactions-list',
    properties: {
      transactionsFilter: {
        type: String,
        observer: '_onFilterChange'
      },
      spent: {
        notify: true
      }
    },
    attached: function() {
      this.transactionsController = this.$.transactionsController;
      this.transactionsParser = this.$.transactionsParser;
    },
    GetTransactions: function(min, max) {
      var promise;
      this.min = moment(min);
      this.max = moment(max);
      min = moment(min).weekday(0).subtract(4, 'days');
      max = moment(max).weekday(7).add(4, 'days');
      promise = this.transactionsController.GetTransactions(null, min, max);
      return promise.then((function(_this) {
        return function(transactions) {
          _this.transactions = _this.transactionsParser.Parse(transactions);
          return _this.FilterTransactions();
        };
      })(this), function(error) {
        return alert(error);
      });
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
        if (moment(transaction.timestamp).isBetween(moment(this.min).subtract(1, 'days'), moment(this.max).add(1, 'days'), 'day')) {
          transaction.active = true;
        } else {
          transaction.active = false;
        }
        if (transaction.category.indexOf('Food and Drink') > -1) {
          food.push(transaction);
        } else {
          other.push(transaction);
        }
      }
      this._caluclateSpent(food);
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
    _caluclateSpent: function(foodArray) {
      var i, item, len, total;
      if (foodArray.length === 0) {
        this.spent = 0;
      } else {
        total = 0;
        for (i = 0, len = foodArray.length; i < len; i++) {
          item = foodArray[i];
          if (item.active) {
            total += item.amount;
          }
        }
        this.spent = total.toFixed(2);
      }
    },
    _onDateChange: function(e) {
      this.$.datePicker.open();
      this.selectedTransaction = e.detail.objectId;
    },
    _onCancelTap: function() {
      this.$.datePicker.close();
    },
    _onDateConfirm: function() {
      var promise;
      this.$.datePicker.close();
      promise = this.transactionsController.UpdateTimestamp(this.selectedTransaction, this.selectedDate);
      promise.then((function(_this) {
        return function(success) {
          _this.GetTransactions(_this.min, _this.max);
          return _this.fire('change-success');
        };
      })(this));
    },
    _onCategoryChange: function(e) {
      var promise;
      promise = this.transactionsController.UpdateCategory(e.detail.objectId, e.detail.newCategory);
      promise.then((function(_this) {
        return function(success) {
          _this.GetTransactions(_this.min, _this.max);
          return _this.fire('change-success');
        };
      })(this));
    }
  });

}).call(this);
