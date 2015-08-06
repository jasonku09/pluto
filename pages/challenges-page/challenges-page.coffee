Polymer
  is: 'challenges-page'

  attached: ->
    test = @$.transactionsParser.CalculateWeeklyAverage(3, "Food and Drink")
    console.log test
    return

  _onChangeSuccess: ->
    @$.successToast.show()
    return
