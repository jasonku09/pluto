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

  _computeDayCounter:(challenge)->
    if moment().isAfter moment(challenge.week).weekday(7)
      return 'Completed'
    totalDays = 8 - challenge.startDay
    if totalDays is 8
      totalDays = 1
    currentDay = moment().weekday() - challenge.startDay + 1
    return "Day " + currentDay + " / " + totalDays

  _computeSavedText:(challenge)->
    if moment().isAfter moment(challenge.week).weekday(7)
      return 'saved'
    else return 'left to spend'

  _calculateSpendable: (spent)->
    if @currentChallenge.maxSpend - spent < 0
      return 0
    else return @currentChallenge.maxSpend - spent

  _GetChallenges: ->
    Challenge = Parse.Object.extend("Challenge")
    query = new Parse.Query(Challenge)
    query.equalTo('userId', @$.user.GetUserId())
    query.descending('timestamp')
    promise = query.find()
    promise.then (challenges)=>
      @_parseChallenges challenges
      @currentChallenge = @challenges[0]
      return

  _parseChallenges: (challenges)->
    temp = []
    for challenge in challenges
      temp.push
        maxSpend: Math.floor challenge.attributes.max_spend
        week: moment(challenge.attributes.week)
        startDay: challenge.attributes.start_day
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
