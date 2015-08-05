(function() {
  Polymer({
    is: 'transactions-parser',
    CalculateWeeklyAverage: function() {},
    _ParseTransactions: function(transactions) {
      var i, len, parsed, transaction;
      parsed = [];
      try {
        for (i = 0, len = transactions.length; i < len; i++) {
          transaction = transactions[i];
          transaction.attributes.timestamp = moment(transaction.attributes.timestamp).format('M / D');
          transaction.attributes.category = transaction.attributes.category || ["UNCATEGORIZED"];
          transaction.attributes.objectId = transaction.id;
          parsed.push(transaction.attributes);
        }
      } catch (_error) {
        return [];
      }
      return parsed;
    }
  });

}).call(this);
