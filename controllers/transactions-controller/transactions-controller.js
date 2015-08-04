(function() {
  Polymer({
    is: 'transactions-controller',
    attached: function() {
      this.ajax = this.$.ajax;
    },
    UpdateCategory: function(transactionId, newCategory) {
      var Transaction, query;
      Transaction = Parse.Object.extend("Transaction");
      query = new Parse.Query(Transaction);
      return query.get(transactionId).then(function(transaction) {
        transaction.set('category', newCategory);
        transaction.save();
      });
    },
    GetCount: function(min, max) {
      var Transaction, query;
      min = min || new Date(new Date() - 1000 * 60 * 60 * 24 * 365 * 100);
      max = max || new Date();
      Transaction = Parse.Object.extend("Transaction");
      query = new Parse.Query(Transaction);
      query.greaterThan('timestamp', min);
      query.lessThan('timestamp', max);
      return query.count();
    },
    GetTransactions: function(min, max, page, limit) {
      var Transaction, query;
      min = new Date(min) || new Date(new Date() - 1000 * 60 * 60 * 24 * 365 * 100);
      max = new Date(max) || new Date();
      page = page || 0;
      limit = limit || 1000;
      Transaction = Parse.Object.extend("Transaction");
      query = new Parse.Query(Transaction);
      query.limit(limit);
      query.greaterThan('timestamp', min);
      query.lessThan('timestamp', max);
      query.skip(page * limit);
      return query.find();
    }
  });

}).call(this);
