Polymer
  is: 'transactions-page'

  attached: ->
    @transactionsController = @$.transactionsController
    promise = @transactionsController.GetTransactions()
    self = this
    promise.then (transactions)->
      self._ParseTransactions(transactions)
    , (error)->
      alert error

  _onBackTap: ->
    @router.go '/home',
      data:
        accounts: @bankAccounts

  _ParseTransactions: (transactions)->
    temp = []
    for transaction in transactions
      transaction.attributes.timestamp = moment(transaction.attributes.timestamp).format('M / D')
      transaction.attributes.category = transaction.attributes.category || ["UNCATEGORIZED"]
      temp.push transaction.attributes
    @transactions = temp
