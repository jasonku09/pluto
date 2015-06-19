Polymer
  is: "pluto-drawer-menu"

  properties:
    user:
      type: Object

  attached: ->
    @.parentNode.style.backgroundColor = 'rgba(0,0,0,0)'

  _onUserReturn: ->
    @user = @users[0]
