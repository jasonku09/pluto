Polymer
  is: 'insights-page'

  attached: ->
    @transactionsController = @$.transactionsController
    promise = @transactionsController.GetTransactions()
    self = this
    promise.then (transactions)->
      self._ParseTransactions(transactions)
    , (error)->
      alert error

  _ParseTransactions: (transactions)->
    categories = {}
    for transaction in transactions
      if transaction.attributes.category
        for category in transaction.attributes.category
          if !categories[category]
            categories[category] = transaction.attributes.amount
          else
            categories[category] += transaction.attributes.amount
    categoryTotals = []
    for category in Object.keys categories
      categoryTotals.push
        name: category
        total: categories[category]
    @categories = categoryTotals
    return

  _onBackTap: ->
    @router.go '/home',
      data:
        accounts: @bankAccounts
