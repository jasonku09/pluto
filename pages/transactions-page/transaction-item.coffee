Polymer
  is: 'transaction-item'

  properties:
    currentPosition:
      type: Number

  _computeSwipeText: (transaction)->
    if transaction.category[0] is "Food and Drink"
      return "Not Food"
    else return "Food"

  attached: ->
    this.setScrollDirection('y', @$.item)
    @currentPosition = 0
    return

  Close: ->
    @currentPosition = 0
    @$.item.style.marginLeft = '0'
    @$.item.style.marginRight = '0'
    return

  _formatAmount: (amount)->
    return amount.toFixed(2)

  _handleTrack: (e)->
    switch e.detail.state
      when 'start'
        console.log 'tracking started!'
      when 'track'
        newPosition = @currentPosition + e.detail.ddx
        if newPosition > 0
          return
        else
          @$.item.style.marginLeft = newPosition + 'px'
          @$.item.style.marginRight = -newPosition + 'px'
          @currentPosition = newPosition
      when 'end'
        @$.item.classList.add 'transition'
        if @currentPosition < -50
          @currentPosition = -100
          @$.item.style.marginLeft = '-100px'
          @$.item.style.marginRight = '100px'
        else
          @Close()
        setTimeout =>
          @$.item.classList.remove 'transition'
        , 400
    return

  _onCategorizeTap: ->
    if @transaction.category[0] is "Food and Drink"
      newCategory = ["Not Food or Drink"]
    else newCategory = ["Food and Drink"]
    @set 'transaction.category', newCategory
    @fire 'category-change', {objectId: @transaction.objectId, newCategory: newCategory}
    @Close()
    return
