Polymer
  is: 'challenges-transactions-list'

  properties:
    transactionsFilter:
      type: String
      observer: '_onFilterChange'
    spent:
      notify: true

  attached: ->
    @transactionsController = @$.transactionsController
    @transactionsParser = @$.transactionsParser
    return

  GetTransactions: (min, max)->
    @min = moment(min)
    @max = moment(max)
    min = moment(min).weekday(0).subtract(4, 'days')
    max = moment(max).weekday(7).add(4, 'days')
    promise = @transactionsController.GetTransactions(null, min, max)
    promise.then (transactions)=>
      @transactions = @transactionsParser.Parse(transactions)
      @FilterTransactions()
    , (error)->
      alert error

  FilterTransactions: ->
    return if !@transactions
    food = []
    other = []
    for transaction in @transactions
      if moment(transaction.timestamp).isBetween(moment(@min).subtract(1, 'days'), moment(@max).add(1, 'days'), 'day')
        transaction.active = true
      else transaction.active = false
      if transaction.category.indexOf('Food and Drink') > -1
        food.push transaction
      else other.push transaction
    @_caluclateSpent(food)
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

  _caluclateSpent: (foodArray)->
    if foodArray.length is 0
      @spent = 0
    else
      total = 0
      for item in foodArray
        if item.active
          total += item.amount
      @spent = total.toFixed(2)
    return

  _onDateChange: (e)->
    @$.datePicker.open()
    @selectedTransaction = e.detail.objectId
    return

  _onCancelTap: ->
    @$.datePicker.close()
    return

  _onDateConfirm: ->
    @$.datePicker.close()
    promise = @transactionsController.UpdateTimestamp @selectedTransaction, @selectedDate
    promise.then (success)=>
      @GetTransactions(@min, @max)
      @fire 'change-success'
    return

  _onCategoryChange: (e)->
    promise = @transactionsController.UpdateCategory e.detail.objectId, e.detail.newCategory
    promise.then (success)=>
      @GetTransactions(@min, @max)
      @fire 'change-success'
    return
