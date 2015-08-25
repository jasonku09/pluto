Polymer
  is: 'challenge-settings-page'

  properties:
    selectedChallenge:
      type: Object
      notify: true
    weeklySpending:
      observer: '_onWeeklySpendingChange'

  attached: ->
    @weekSpan = moment().format('ddd') + ' - Sun '
    @selectedPercentage = null
    return

  _computeItemStyle: (selectedPercentage, percentage)->
    if percentage is selectedPercentage
      return 'color: #9ad7db; border-color: #9ad7db'
    else return ''

  _computeChallengeSavings: (percentage)->
    return '$' + Math.ceil(@weeklySpending * percentage / 100)

  _computeQuestionHidden: (selectedPercentage)->
    return selectedPercentage != null

  _computeInfoHidden: (selectedPercentage)->
    return selectedPercentage is null

  _dollarize: (amount)->
    return '$' + amount

  _onPercentageTap: (e)->
    target = e.target
    while target != @ && !target._templateInstance
      target = target.parentNode
    @selectedPercentage = @$.percentageRepeat.itemForElement(target)
    @maxSpend = Math.round((@weeklySpending - (@selectedPercentage * @weeklySpending / 100)) * 100) / 100
    @saveAmount = Math.round(@weeklySpending * @selectedPercentage) / 100
    @selectedChallenge = {
      maxSpend: @maxSpend
      savePercentage: @selectedPercentage
      averageSpending: @weeklySpending
    }
    return

  _onWeeklySpendingChange: ->
    @challengePercentages = [10, 20, 30]
    return
