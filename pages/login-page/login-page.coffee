Polymer
  is: "login-page"

  _computeSignupHidden: (tab)->
    return tab is 'Login'

  attached: ->
    @selectedTab = "Login"
    @loading = false
    @error = false
    return

  _onButtonTap: ->
    return if not @_ValidateInputs()
    if @selectedTab is 'Login'
      @_Login()
    else
      @_Signup()
    return

  _Login: ->
    @loadingLabel = "Logging in"
    @loading = true
    promise = Parse.User.logIn(@email, @password)
    promise.then (success)=>
      @_onSignupSuccess()
    , @_onError.bind(this)
    return

  _Signup: ->
    return if not @_ValidateInputs()
    @loadingLabel = "Creating Account"
    @loading = true
    user = new Parse.User()
    user.set "email", @email
    user.set "username", @email
    user.set "password", @password
    user.set "nickname", @name

    promise = user.signUp(null)
    promise.then (success)=>
      @$.signupConfirmationDialog.open()
    , @_onError.bind(this)
    return

  _onCancelTap: ->
    @signup = false
    return

  _ValidateInputs: ->
    inputs = [@$.emailInput, @$.passwordInput]
    if @selectedTab is 'Signup'
      inputs.push @$.nameInput
      if @password != @passwordConfirm
        @error = true
        @errorMessage = "Oops, passwords do not match"
        return
      inputs.push @$.passwordInputConfirm
    for input in inputs
      if input.value.length is 0
        input.invalid = true
      input.validate()
      if input.invalid
        return false
    return true

  _onSignupSuccess: ->
    Challenge = Parse.Object.extend("Challenge")
    query = new Parse.Query(Challenge)
    query.equalTo 'userId', Parse.User.current().get('username')
    query.first().then (challenge)=>
      if !challenge
        @router.go "/onboarding"
      else @router.go "/home"
    return

  _onError: (error)->
    switch error.code
      when 100 then @errorMessage = "Connection to servers failed, please try again later"
      when 101 then @errorMessage = "Incorrect username or password"
      when 202 then @errorMessage = "An account with that email already exists"
      when 203 then @errorMessage = "An account with that email already exists"
    @loading = false
    @error = true
    return
