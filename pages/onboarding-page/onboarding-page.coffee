Polymer
  is: "onboarding-page"

  _computeCalculatingText: (calculating)->
    if calculating
      return "Calculating your average weekly spend on Food and Drink"
    else return "Your weekly average spend on Food and Drinks is"

  _computeNextButtonStyle: (selectedPage, bankAccountsReady)->
    if selectedPage is 4 && !bankAccountsReady
      return 'color: grey; background-color: lightgrey;'
    else
      return ''

  _computeHeaderText: (selectedPage)->
    switch selectedPage
      when 0 then return "WELCOME"
      when 1 then return "WHAT IS YOUR GOAL?"
      when 2 then return "WHAT IS YOUR GOAL?"
      when 3 then return "WHAT IS YOUR GOAL?"
      when 4 then return "LINK YOUR ACCOUNTS"
      when 5 then return "PICK YOUR CHALLENGE"
      when 6 then return "CHALLENGE DETAIL"

  _computeButtonText: (selectedPage, bankAccountsReady)->
    switch selectedPage
      when 0 then return "OKAY"
      when 1 then return "NEXT"
      when 2 then return "NEXT"
      when 3 then return "SOUNDS GOOD"
      when 4
        if !bankAccountsReady
          return 'Please Wait...'
        else return 'NEXT'
      when 5 then return 'SELECT'
      when 6 then return 'CHALLENGE ACCEPTED'

  attached: ->
    @selectedPage = 0
    return

  _computeBackHidden: (selectedPage)->
    return selectedPage is 0

  _computeProgressValue: (selectedPage)->
    return @selectedPage / 6 * 100

  _onBackTap: ->
    @selectedPage--
    return

  _onNextTap: ->
    #if @selectedPage is 4
    #  if !@bankAccounts || @bankAccounts.length is 0
    #    alert "Please link at least 1 bank account to continue"
    #    return
    #  return if !@bankAccountsReady

    if @selectedPage is 5
      @$.calculateDialog.open()
      @calculating = true
      @_CalculateAverage('Food and Drink')
      return

    else if @selectedPage is 6
      promise = @$.challengesController.CreateNewChallenge @selectedChallenge.maxSpend,
        @selectedChallenge.averageSpending,
        @selectedChallenge.savePercentage
      @$.creatingDialog.open()
      promise.then ()=>
        @$.challengesController.CreateNewGoal(@goalItem, @goalAmount).then ()=>
          @$.creatingDialog.close()
          @$.confirmationDialog.open()
          return
      , (error)=>
        console.log error
        return
      return

    @selectedPage++
    return

  _onOkayTap: ->
    @$.calculateDialog.close()
    @selectedPage++
    return

  _CalculateAverage: (category)->
    promise = @$.transactionsParser.CalculateWeeklyAverage(moment().weekday(), category)
    promise.then (average)=>
      @weeklySpending = average
      @calculating = false
      return
    return

  _onConfirmClose: ->
    @router.go '/home'
    return
