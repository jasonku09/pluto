Polymer
  is: 'challenges-page'

  attached: ->
    @_GetChallenges()
    @selectedTab = 'active'
    @selectedChallenge = null
    @loading = false
    return

  _formatDate: (challenge)->
    return if !challenge
    return challenge.week.format('MMMM ') +
      moment(challenge.week).weekday(challenge.startDay).format('D - ') +
      moment(challenge.week).weekday(7).format('D, ') +
      challenge.week.format 'YYYY'

  _computeMainHidden: (selectedChallenge, loading)-> selectedChallenge != null || loading

  _computeDetailsHidden: (selectedChallenge, loading)-> selectedChallenge is null || loading

  _computeChallenges:(challenges, selectedTab)->
    filtered = []
    filter = if selectedTab is 'active' then 'In Progress' else 'Completed'
    for challenge in challenges
      if challenge.status is filter
        filtered.push challenge
    return filtered

  _computeDayCounter:(challenge)->
    return if !challenge
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

  _onChallengeTap: (e)->
    target = e.target
    while target != @ && !target._templateInstance
      target = target.parentNode
    @selectedChallenge = @$.challengeRepeat.itemForElement(target)
    @loading = true
    return

  _onDetailsReady: ->
    @loading = false

  _onBackTap: ->
    @selectedChallenge = null

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
