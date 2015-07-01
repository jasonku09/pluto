Polymer
  is: "pluto-drawer-menu"

  properties:
    user:
      type: Object

  attached: ->
    @.parentNode.style.backgroundColor = 'rgba(0,0,0,0)'

  _onUserReturn: ->

  _onLogoutTap: ->
    Parse.User.logOut()
    @router.go '/login'
    return
