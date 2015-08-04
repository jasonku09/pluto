Polymer
  is: 'transactions-controller'

  attached: ->
    @ajax = @$.ajax
    return

  UpdateCategory: (transactionId, newCategory)->
    Transaction = Parse.Object.extend "Transaction"
    query = new Parse.Query(Transaction)
    query.get(transactionId).then (transaction)->
      transaction.set 'category', newCategory
      transaction.save()
      return

  GetCount: (min, max)->
    min = min || new Date( new Date() - 1000 * 60 * 60 * 24 * 365 * 100) # 100 years ago
    max = max || new Date() # today
    Transaction = Parse.Object.extend "Transaction"
    query = new Parse.Query(Transaction)
    query.greaterThan 'timestamp', min
    query.lessThan 'timestamp', max
    query.count()

  GetTransactions: (min, max, page, limit)->
    min = new Date(min) || new Date( new Date() - 1000 * 60 * 60 * 24 * 365 * 100) # 100 years ago
    max = new Date(max) || new Date() # today
    page = page || 0
    limit = limit || 1000
    Transaction = Parse.Object.extend "Transaction"
    query = new Parse.Query(Transaction)
    query.limit(limit)
    query.greaterThan 'timestamp', min
    query.lessThan 'timestamp', max
    query.skip page * limit
    query.find()
