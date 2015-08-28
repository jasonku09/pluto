Polymer
  is: 'challenge-details-page'

  properties:
    challenge:
      observer: '_onChallengeChange'

  attached: ->
    @viewTransactions = false
    return

  # Computes
  _computeProgressHidden: (selectedTab)-> selectedTab != 'progress'

  _computeInsightsHidden: (selectedTab)-> selectedTab != 'insights'

  _computeTransactionsHidden: (selectedTab)->
    if selectedTab is 'transactions'
      @$.transactionsList.transactionsFilter = 'food'
      return false
    else return true

  _computeDayCounter:(challenge)->
    return if !@challenge
    if moment().isAfter moment(challenge.week).weekday(7)
      return 'Completed'
    totalDays = 8 - challenge.startDay
    if totalDays is 8
      totalDays = 1
    if moment().weekday() is 0
      weekday = 7
    else weekday = moment().weekday()
    currentDay = weekday - challenge.startDay + 1
    return "Day " + currentDay + " / " + totalDays

  _computeSavedText:(challenge)->
    return if !@challenge
    if moment().isAfter moment(challenge.week).weekday(7)
      return 'saved'
    else return 'left to spend'

  _computeSpendable: (spent)->
    return if !spent
    if @challenge.status is 'Completed'
      amount = @challenge.averageSpend - spent
      if amount < 0
        amount = 0
    else if @challenge.maxSpend - spent < 0
      amount =  0
    else
      amount = @challenge.maxSpend - spent
    return amount.toFixed(2)

  # On-Change

  _onChallengeChange: ->
    return if !@challenge
    week = @challenge.week
    challengeStart = moment(week).weekday(@challenge.startDay)
    challengeEnd = moment(week).weekday(7)
    @$.transactionsList.GetTransactions(challengeStart, challengeEnd).then ()=>
      @selectedTab = 'progress'
      @fire 'ready'
    return
