Polymer
  is: 'challenges-page'

  properties:
    transactionsFilter:
      type: String
      observer: '_onFilterChange'

  attached: ->
    @transactionsController = @$.transactionsController
    promise = @transactionsController.GetTransactions(moment().weekday(1).subtract(14, 'days'), moment().weekday(7).subtract(14, 'days'))
    self = this
    promise.then (transactions)->
      self._ParseTransactions(transactions)
    , (error)->
      alert error
    @transactionsFilter = 'food'
    return

  _ParseTransactions: (transactions)->
    temp = []
    for transaction in transactions
      transaction.attributes.timestamp = moment(transaction.attributes.timestamp).format('M / D')
      transaction.attributes.category = transaction.attributes.category || ["UNCATEGORIZED"]
      temp.push transaction.attributes
    @transactions = temp
    @FilterTransactions()
    return

  FilterTransactions: ->
    return if !@transactions
    if @transactionsFilter is 'food'
      temp = []
      for transaction in @transactions
        if transaction.category.indexOf('Food and Drink') > -1
          temp.push transaction
      @filteredTransactions = temp
    else
      @filteredTransactions = @transactions
    return

  _onFilterChange: ->
    if @transactionsFilter is 'food'
      @$.allButton.classList.remove 'active'
      @$.foodButton.classList.add 'active'
    else
      @$.allButton.classList.add 'active'
      @$.foodButton.classList.remove 'active'
    @FilterTransactions()
    return

  _onFoodTap: ->
    @transactionsFilter = 'food'
    return

  _onAllTap: ->
    @transactionsFilter = 'all'
    return
