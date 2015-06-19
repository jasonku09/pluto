Polymer
  is: "goals-tab"

  _onItemClick: ->
    @$.pages.selected = 1
    return

  _onClose: ->
    @$.pages.selected = 0
