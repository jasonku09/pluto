Polymer
  is: 'challenges-transactions-list'

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
      transaction.attributes.objectId = transaction.id
      temp.push transaction.attributes
    @transactions = temp
    @FilterTransactions()
    return

  FilterTransactions: ->
    return if !@transactions
    food = []
    other = []
    for transaction in @transactions
      if transaction.category.indexOf('Food and Drink') > -1
        food.push transaction
      else other.push transaction
    if @transactionsFilter is 'food'
      @filteredTransactions = food
    else @filteredTransactions = other
    return

  _onFilterChange: ->
    transactionItems = document.querySelectorAll 'transaction-item'
    for item in transactionItems
      item.Close()
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

  _onOtherTap: ->
    @transactionsFilter = 'all'
    return

  _onCategoryChange: (e)->
    for transaction in @transactions
      if transaction.objectId is e.detail.objectId
        transaction.category = e.detail.newCategory
    promise = @transactionsController.UpdateCategory e.detail.objectId, e.detail.newCategory
    self = this
    promise.then (success)->
      self.FilterTransactions()
      self.fire 'change-success'
    return
