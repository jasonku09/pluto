(function() {
  Polymer({
    is: 'transactions-parser',
    attached: function() {
      this.transactionsController = this.$.transactionsController;
    },
    CalculateWeeklyAverage: function(startDay, category) {
      var transactionsPromise;
      transactionsPromise = this.$.transactionsController.GetTransactions('Food and Drink');
      return transactionsPromise.then((function(_this) {
        return function(transactions) {
          var bankTransactionDictionary, i, len, minDate, transaction;
          transactions = _this.Parse(transactions);
          bankTransactionDictionary = {};
          for (i = 0, len = transactions.length; i < len; i++) {
            transaction = transactions[i];
            if (transaction.category.indexOf(category) === -1) {
              continue;
            }
            if (!bankTransactionDictionary[transaction.bankAccount]) {
              bankTransactionDictionary[transaction.bankAccount] = [transaction];
            } else {
              bankTransactionDictionary[transaction.bankAccount].push(transaction);
            }
          }
          minDate = _this._getMinWeekday(bankTransactionDictionary, startDay);
          return _this._getWeeklyTotals(transactions, startDay, minDate);
        };
      })(this));
    },
    Parse: function(transactions) {
      var i, len, parsed, transaction;
      parsed = [];
      try {
        for (i = 0, len = transactions.length; i < len; i++) {
          transaction = transactions[i];
          transaction.attributes.timestamp = moment(transaction.attributes.timestamp).add(1, 'days');
          transaction.attributes.category = transaction.attributes.category || ["UNCATEGORIZED"];
          transaction.attributes.objectId = transaction.id;
          parsed.push(transaction.attributes);
        }
      } catch (_error) {
        return [];
      }
      return parsed;
    },
    _getAllTransactions: function() {
      var promise;
      promise = this.$.transactionsController.GetTransactions();
      promise.then((function(_this) {
        return function(transactions) {
          return _this.Parse(transactions);
        };
      })(this));
    },
    _getMinWeekday: function(dictionary, startDay) {
      var bank, date, i, j, len, len1, minDate, minDates, minWeek, ref, transactionsArray;
      minDates = [];
      ref = Object.keys(dictionary);
      for (i = 0, len = ref.length; i < len; i++) {
        bank = ref[i];
        transactionsArray = dictionary[bank];
        minWeek = moment(transactionsArray[transactionsArray.length - 1].timestamp).add(7, 'days');
        minDates.push(minWeek.weekday(startDay));
      }
      minDate = minDates[0];
      for (j = 0, len1 = minDates.length; j < len1; j++) {
        date = minDates[j];
        if (date.isAfter(minDate)) {
          minDate = date;
        }
      }
      return minDate;
    },
    _getWeeklyTotals: function(transactions, startDay, minDate) {
      var currentDate, currentIndex, total, totalsArray;
      totalsArray = [];
      transactions = transactions.reverse();
      currentDate = minDate;
      currentIndex = 0;
      while (moment(currentDate).weekday(7).isBefore(moment().weekday(0))) {
        while (transactions[currentIndex].timestamp.isBefore(currentDate.weekday(startDay)) && (currentIndex < transactions.length - 1)) {
          currentIndex++;
        }
        total = 0;
        while (transactions[currentIndex].timestamp.isBetween(moment(currentDate).weekday(startDay).subtract(1, 'days'), moment(currentDate).weekday(7).add(1, 'days'), 'day') && currentIndex < transactions.length - 1) {
          total += transactions[currentIndex].amount;
          currentIndex++;
        }
        totalsArray.push(total);
        currentDate = currentDate.add(7, 'days');
      }
      return totalsArray;
    }
  });

}).call(this);
