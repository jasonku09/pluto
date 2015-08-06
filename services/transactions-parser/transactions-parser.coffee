Polymer
  is: 'transactions-parser'

  attached: ->
    @transactionsController = @$.transactionsController
    return

  # Gets the weekly average spending between startDay(1-7) and sunday
  CalculateWeeklyAverage: (startDay, category)->
    transactionsPromise = @$.transactionsController.GetTransactions('Food and Drink')
    transactionsPromise.then (transactions)=>
      transactions = @Parse transactions
      bankTransactionDictionary = {}
      for transaction in transactions
        if transaction.category.indexOf(category) is -1
          continue
        if !bankTransactionDictionary[transaction.bankAccount]
          bankTransactionDictionary[transaction.bankAccount] = [transaction]
        else bankTransactionDictionary[transaction.bankAccount].push transaction
      minDate = @_getMinWeekday bankTransactionDictionary, startDay
      @_getWeeklyTotals transactions, startDay, minDate

  Parse: (transactions)->
    parsed = []
    try
      for transaction in transactions
        transaction.attributes.timestamp = moment(transaction.attributes.timestamp).add(1, 'days')
        transaction.attributes.category = transaction.attributes.category || ["UNCATEGORIZED"]
        transaction.attributes.objectId = transaction.id
        parsed.push transaction.attributes
    catch
      return []
    parsed

  _getAllTransactions: ->
    promise = @$.transactionsController.GetTransactions()
    promise.then (transactions)=>
      @Parse transactions
    return

  # Gets the earliest week of transactions
  _getMinWeekday: (dictionary, startDay)->
    minDates = []
    for bank in Object.keys dictionary
      transactionsArray = dictionary[bank]
      minWeek = moment(transactionsArray[transactionsArray.length - 1].timestamp).add(7, 'days')
      minDates.push minWeek.weekday(startDay)
    minDate = minDates[0]
    for date in minDates
      if date.isAfter minDate
        minDate = date
    minDate

  _getWeeklyTotals: (transactions, startDay, minDate)->
    totalsArray = []
    transactions = transactions.reverse()
    currentDate = minDate
    currentIndex = 0
    while (moment(currentDate).weekday(7).isBefore moment().weekday(0))
      while transactions[currentIndex].timestamp.isBefore(currentDate.weekday(startDay)) && (currentIndex < transactions.length - 1)
        currentIndex++
      total = 0
      while transactions[currentIndex].timestamp.isBetween(moment(currentDate).weekday(startDay).subtract(1, 'days'), moment(currentDate).weekday(7).add(1, 'days'), 'day') &&
          currentIndex < transactions.length - 1
        total += transactions[currentIndex].amount
        currentIndex++
      totalsArray.push total
      currentDate = currentDate.add(7, 'days')
    totalsArray
