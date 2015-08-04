(function() {
  Polymer({
    is: 'transactions-page',
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
    _onBackTap: function() {
      return this.router.go('/home', {
        data: {
          accounts: this.bankAccounts
        }
      });
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
      return this.transactions = temp;
    }
  });

}).call(this);
