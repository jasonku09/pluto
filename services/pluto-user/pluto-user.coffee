class User
  loggedIn: false
  userId: ''
  sessionToken: ''

user = user || new User()

Polymer
  is: 'pluto-user'

  attached: ->
    Parse.initialize(PlutoMetadata.Parse.ClientID, PlutoMetadata.Parse.Secret)
    if !user.initialized
      @_Initialize()
      return
    else
      @fire 'ready'
      return

  _Initialize: ->
    currentUser = Parse.User.current()
    if currentUser is null
      @fire 'ready'
      return
    else
      user.loggedIn = true
      @UpdateUser()
      @fire 'ready'
      return

  UpdateUser: ->
    user.userId = Parse.User.current().get('username')
    user.sessionToken = Parse.User.current()._sessionToken
    return

  IsLoggedIn: -> user.loggedIn

  GetUserId: -> user.userId

  GetSessionToken: -> user.sessionToken
