Polymer
  is: 'transaction-item'

  properties:
    currentPosition: Number

  attached: ->
    this.setScrollDirection('y', @$.item)
    @currentPosition = 0
    return

  _formatAmount: (amount)->
    return amount.toFixed(2)

  _handleTrack: (e)->
    switch e.detail.state
      when 'start'
        console.log 'tracking started!'
      when 'track'
        @$.item.style.marginLeft = (@currentPosition + e.detail.ddx) + 'px'
        @currentPosition += e.detail.ddx
        console.log 'Tracking in progress...' + e.detail.x + ', ' + e.detail.y
      when 'end'
        console.log 'Tracking ended'
