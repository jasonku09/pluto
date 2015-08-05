Polymer
  is: 'transactions-parser'

  CalculateWeeklyAverage: ->

  _ParseTransactions: (transactions)->
    parsed = []
    try
      for transaction in transactions
        transaction.attributes.timestamp = moment(transaction.attributes.timestamp).format('M / D')
        transaction.attributes.category = transaction.attributes.category || ["UNCATEGORIZED"]
        transaction.attributes.objectId = transaction.id
        parsed.push transaction.attributes
    catch
      return []
    parsed
