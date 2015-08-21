class User
  loggedIn: false
  userId: ''
  sessionToken: ''
  onboarded: false

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
      promise = @_CheckOnboarded()
      promise.then (challenge)=>
        if !challenge
          user.onboarded = false
        else user.onboarded = true
        @fire 'ready'
      return

  UpdateUser: ->
    user.userId = Parse.User.current().get('username')
    user.sessionToken = Parse.User.current()._sessionToken
    return

  _CheckOnboarded: ->
    Challenge = Parse.Object.extend("Challenge")
    query = new Parse.Query(Challenge)
    query.equalTo 'userId', user.userId
    query.first()

  IsOnboarded: -> user.onboarded

  IsLoggedIn: -> user.loggedIn

  GetUserId: -> user.userId

  GetSessionToken: -> user.sessionToken
