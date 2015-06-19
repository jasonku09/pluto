Polymer
  is: "pluto-navbar"

  properties:
      tabs:
        type: Object
        value: [
          name: "Feed"
          icon: 'home'
        ,
          name: "Goals"
          icon: 'flag'
        ,
          name: "Rewards"
          icon: 'star-border'
        ,
          name: "Dashboard"
          icon: 'dashboard'
        ]

      tab:
        type: String
        observer: "_onTabChanged"

  attached: ->
    if !@tab
      @tab = "Goals"
    return

  _computeIconStyle: (item)->
    if @tab == item.name
      return 'color:white'
    else return 'color: #4b786a'

  _onTabChanged: ->
    @router.go "/" + @tab.toLowerCase()
    return
