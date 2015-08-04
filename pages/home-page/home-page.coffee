Polymer
  is: "home-page"

  attached: ->
    currentUser = Parse.User.current()
    user = {}
    user.name = currentUser.get('fullname')
    user.email = currentUser.get('email')
    user.username = currentUser.get('username')
    @user = user
    return

  _onMenuItemSelected: ->
    @$.drawerPanel.closeDrawer()
    return
