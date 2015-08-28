Polymer
  is: "pluto-navbar"

  properties:
      tabs:
        type: Object
        value: [
          name: "Challenges"
          icon: 'home'
        ,
          name: "Goals"
          icon: 'flag'
        ,
          name: "Accounts"
          icon: 'star-border'
        ,
          name: "Settings"
          icon: 'settings'
        ]

      tab:
        type: String
        observer: "_onTabChanged"

  attached: ->
    if !@tab
      @tab = "Challenges"
    return

  _computeIconStyle: (item)->
    if @tab == item.name
      return 'color: #5DCAD1'
    else return 'color: #9c9c9c'

  _onTabChanged: ->
    @router.go "/" + @tab.toLowerCase()
    return
