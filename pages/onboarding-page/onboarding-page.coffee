Polymer
  is: "onboarding-page"

  _computeNextButtonStyle: (selectedPage, bankAccountsReady)->
    if selectedPage is 1 && !bankAccountsReady
      return 'color: grey; background-color: lightgrey;'
    else
      return ''

  _computeHeaderText: (selectedPage)->
    if selectedPage is 0
      return "PICK YOUR CHALLENGE"
    else if selectedPage is 1
      return "LINK YOUR ACCOUNTS"
    else return "SET YOUR GOAL"

  _computeButtonText: (selectedPage, bankAccountsReady)->
    if selectedPage is 0
      return 'NEXT'
    else if selectedPage is 1
      if !bankAccountsReady
        return 'Please Wait...'
      else return 'NEXT'
    else return 'CHALLENGE ACCEPTED'

  attached: ->
    @selectedPage = 0
    return

  _computeBackHidden: (selectedPage)->
    return selectedPage is 0

  _computeProgressValue: (selectedPage)->
    return @selectedPage / 2 * 100

  _onBackTap: ->
    @selectedPage--
    return

  _onNextTap: ->
    if @selectedPage is 1
      if !@bankAccounts || @bankAccounts.length is 0
        alert "Please link at least 1 bank account to continue"
        return
      return if !@bankAccountsReady
      @$.challengeSettingsPage.CalculateWeeklyAverage()

    else if @selectedPage is 2
      promise = @$.challengesController.CreateNewChallenge @selectedChallenge.maxSpend,
        @selectedChallenge.averageSpending,
        @selectedChallenge.savePercentage
      promise.then ()=>
        @$.confirmationDialog.open()
        return
      , (error)=>
        console.log error
        return
      return

    @selectedPage++
    return

  _onConfirmClose: ->
    @router.go '/home'
    return
