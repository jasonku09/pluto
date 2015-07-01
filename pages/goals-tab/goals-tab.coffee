Polymer
  is: "goals-tab"

  _onItemClick: ->
    @$.pages.selected = 1
    return
  _onAddClick: ->
    @$.pages.selected = 2

  _onClose: ->
    @$.pages.selected = 0
