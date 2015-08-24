Polymer
  is: 'challenges-page'

  properties:
    currentChallenge:
      observer: '_onChallengeChange'

  attached: ->
    @_GetChallenges()
    @viewTransactions = false
    return

  _formatDate: (challenge)->
    return challenge.week.format('MMMM ') +
      moment(challenge.week).weekday(challenge.startDay).format('D - ') +
      moment(challenge.week).weekday(7).format('D, ') +
      challenge.week.format 'YYYY'

  _computePreviousArrowStyle: (index)->
    if index is (@challenges.length - 1)
      return 'color: lightgrey'
    else return 'color: grey'

  _computeNextArrowStyle: (index)->
    if index is 0
      return 'color: lightgrey'
    else return 'color: grey'

  _computeDayCounter:(challenge)->
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
    if moment().isAfter moment(challenge.week).weekday(7)
      return 'saved'
    else return 'left to spend'

  _calculateSpendable: (spent)->
    return if !spent
    if @currentChallenge.status is 'Completed'
      amount = @currentChallenge.averageSpend - spent
      if amount < 0
        amount = 0
      return amount.toFixed(2)
    else if @currentChallenge.maxSpend - spent < 0
      return 0
    else return @currentChallenge.maxSpend - spent

  _GetChallenges: ->
    Challenge = Parse.Object.extend("Challenge")
    query = new Parse.Query(Challenge)
    query.equalTo('userId', Parse.User.current().get('username'))
    query.descending('week')
    promise = query.find()
    promise.then (challenges)=>
      @_parseChallenges challenges
      @currentChallengeIndex = 0
      @currentChallenge = @challenges[@currentChallengeIndex]
      if @currentChallenge.status is "Completed"
        @$.newChallengeDialog.open()
      return

  _parseChallenges: (challenges)->
    temp = []
    for challenge in challenges
      if moment().isAfter(moment(challenge.attributes.week).add(6, 'days'), 'day')
        challenge.set('status', 'Completed')
        challenge.save()
      temp.push
        maxSpend: Math.floor challenge.attributes.max_spend
        week: moment(challenge.attributes.week)
        startDay: challenge.attributes.start_day
        averageSpend: challenge.attributes.average_spending
        savePercentage: challenge.attributes.save_percentage
        status: challenge.attributes.status
    @challenges = temp
    return

  _onChallengeChange: ->
    week = @currentChallenge.week
    challengeStart = moment(week).weekday(@currentChallenge.startDay)
    challengeEnd = moment(week).weekday(7)
    @$.transactionsList.GetTransactions(challengeStart, challengeEnd)
    return

  _onBackTap: ->
    @viewTransactions = false
    return

  _ViewTransactions: ->
    @viewTransactions = true
    @$.transactionsList.transactionsFilter = 'food'
    return

  _onChangeSuccess: ->
    @$.successToast.show()
    return

  _CreateNewChallenge: ->
    promise = @$.transactionsParser.CalculateWeeklyAverage(moment().weekday(), 'Food and Drink')
    promise.then (average)=>
      savePercentage = @challenges[0].savePercentage
      weeklySpending = Math.round(average.reduce((a,b)-> return a + b) / average.length * 100) / 100
      maxSpend = Math.round((weeklySpending - (savePercentage * weeklySpending / 100)) * 100) / 100
      @$.challengesController.CreateNewChallenge(maxSpend, weeklySpending, savePercentage).then ()=>
        @$.newChallengeDialog.close()
        @_GetChallenges()
      return

  _viewPreviousChallenge: ->
    return if @currentChallengeIndex is (@challenges.length - 1)
    @currentChallengeIndex++
    @currentChallenge = @challenges[@currentChallengeIndex]
    return

  _viewNextChallenge: ->
    return if @currentChallengeIndex is 0
    @currentChallengeIndex--
    @currentChallenge = @challenges[@currentChallengeIndex]
    return
