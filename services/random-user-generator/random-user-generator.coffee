Polymer
  is: 'random-user-generator'

  properties:
    users:
      type: Array
      notify: true

    numberRequested:
      type: Number

  attached: ->
    @users = []
    for [1..@numberRequested]
      @$.userAjax.generateRequest()
    return

  _handleResponse: (response)->
    @push 'users', @lastUser.results[0].user
    if @users.length is @numberRequested
      @fire 'complete'
    return
