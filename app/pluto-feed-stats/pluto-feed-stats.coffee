Polymer
  is: "pluto-feed-stats"

  attached: ->
    @totalCash = 1500
    @totalSaved = 780
    @totalSpendable = 190
    @saved = 0
    @spendable = 0
    @cash = 0
    @checkCash()
    return

  checkCash: ->
    check = false
    if @saved < @totalSaved
      @saved += 10
      check = true

    if @cash < @totalCash
      @cash += 10
      check = true

    if @spendable < @totalSpendable
      @spendable += 5
      check = true

    if check
      setTimeout @checkCash.bind @, 500

  incrementCash: ->
    @checkCash()
    return
