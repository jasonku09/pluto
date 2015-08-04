Polymer
  is: "pluto-drawer-menu"

  properties:
    user:
      type: Object
    menuItems:
      value: [
        name: 'Challenges'
        value: 'challenges'
      ,
        name: 'Bank Accounts'
        value: 'accounts'
      ,
        name: 'Settings'
        value: 'settings'
      ]
  attached: ->
    @.parentNode.style.backgroundColor = 'rgba(0,0,0,0)'
    @router.go '/challenges'
    return

  _onLogoutTap: ->
    Parse.User.logOut()
    @router.go '/login'
    @fire 'item-selected'
    return

  _onMenuItemTap: (e)->
    item = @$.menuRepeat.itemForElement e.target
    @router.go '/' + item.value
    @fire 'item-selected'
    return
