(function() {
  Polymer({
    is: 'insights-page',
    attached: function() {
      var promise, self;
      this.transactionsController = this.$.transactionsController;
      promise = this.transactionsController.GetTransactions();
      self = this;
      return promise.then(function(transactions) {
        return self._ParseTransactions(transactions);
      }, function(error) {
        return alert(error);
      });
    },
    _ParseTransactions: function(transactions) {
      var categories, category, categoryTotals, i, j, k, len, len1, len2, ref, ref1, transaction;
      categories = {};
      for (i = 0, len = transactions.length; i < len; i++) {
        transaction = transactions[i];
        if (transaction.attributes.category) {
          ref = transaction.attributes.category;
          for (j = 0, len1 = ref.length; j < len1; j++) {
            category = ref[j];
            if (!categories[category]) {
              categories[category] = transaction.attributes.amount;
            } else {
              categories[category] += transaction.attributes.amount;
            }
          }
        }
      }
      categoryTotals = [];
      ref1 = Object.keys(categories);
      for (k = 0, len2 = ref1.length; k < len2; k++) {
        category = ref1[k];
        categoryTotals.push({
          name: category,
          total: categories[category]
        });
      }
      this.categories = categoryTotals;
    },
    _onBackTap: function() {
      return this.router.go('/home', {
        data: {
          accounts: this.bankAccounts
        }
      });
    }
  });

}).call(this);
