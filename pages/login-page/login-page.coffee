Polymer
  is: "login-page"

  properties:
    signup:
      observer: '_onSignupChange'
    loading:
      observer: '_onLoadingChange'


  attached: ->
    @signup = false
    @loading = false
    @error = false
    return

  _onLoginTap: ->
    return if not @_ValidateInputs()
    @loadingLabel = "Logging in"
    @loading = true
    promise = Parse.User.logIn(@email, @password)
    promise.then @_onLoginSuccess.bind(this), @_onError.bind(this)
    #@router.go "/home"
    return

  _onSignupTap: ->
    if !@signup
      @signup = true
      return
    else
      return if not @_ValidateInputs()
      @loadingLabel = "Creating Account"
      @loading = true
      user = new Parse.User()
      user.set "email", @email
      user.set "username", @email
      user.set "password", @password
      user.set "nickname", @username

      promise = user.signUp(null)
      promise.then @_onSignupSuccess.bind(this), @_onError.bind(this)
    return

  _onCancelTap: ->
    @signup = false
    return

  _ValidateInputs: ->
    inputs = [@$.emailInput, @$.passwordInput]
    if @signup
      inputs.push @$.usernameInput
    for input in inputs
      if input.value.length is 0
        input.invalid = true
      input.validate()
      if input.invalid
        return false
    return true

  _onSignupSuccess: ->
    @router.go "/home"
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

  _onLoginSuccess: ->
    @router.go "/home"
    return

  # Change Listeners
  _onSignupChange: ->
    @loginError = false
    if @signup
      @$.signupCollapse.opened = true
      @$.container.style.opacity = 1
    else
      @$.signupCollapse.opened = false
      @$.container.style.opacity = 0
    return

  _onLoadingChange: ->
    if @loading
      @$.inputContainer.classList.add('hide')
      @$.buttonContainer.classList.add('hide')
      @$.loadingIndicator.classList.add('show')
    else
      @$.inputContainer.classList.remove('hide')
      @$.buttonContainer.classList.remove('hide')
      @$.loadingIndicator.classList.remove('show')
    return
