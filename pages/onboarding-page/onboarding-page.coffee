Polymer
  is: "onboarding-page"

  properties:
    challengePercentages:
      value: [10, 18, 25]

  _computeNextButtonStyle: (selectedPage, bankAccountsReady)->
    if selectedPage is 1 && !bankAccountsReady
      return 'color: grey; background-color: lightgrey;'
    else
      return ''

  _computeButtonText: (selectedPage, bankAccountsReady)->
    if selectedPage is 0
      return 'LETS DO IT'
    else if selectedPage is 1
      if !bankAccountsReady
        return 'Please Wait...'
      else return 'NEXT'
    else return 'CHALLENGE ACCEPTED'

  attached: ->
    @selectedPage = 0
    @weeklySpending = 98
    return

  _computeBackHidden: (selectedPage)->
    return selectedPage is 0

  _computeProgressValue: (selectedPage)->
    return (@selectedPage + 1) / 3 * 100

  _computeChallengeSavings: (percentage)->
    return '$' + Math.ceil(@weeklySpending * percentage / 100)

  _getWeeklySpending: (weeklySpending)->
    return '$' + weeklySpending

  _onBackTap: ->
    @selectedPage--
    return

  _onNextTap: ->
    @selectedPage++
    return
