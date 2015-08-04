Polymer
  is: 'bank-accounts-controller'

  attached: ->
    @ajax = @$.ajax
    if PlutoMetadata.Environment is "Production"
      @baseUrl = ''
    else @baseUrl = "http://localhost:3000"
    return

  AddBankAccount: (authToken, publicToken)->
    body = @EncodeQueryData {
      authtoken: authToken
      publictoken: publicToken
    }
    promise = @ajax.send
      url: @baseUrl + '/bankaccounts/add'
      method: 'POST'
      body: body
      contentType: 'application/x-www-form-urlencoded'

  GetBankAccounts: (authToken)->
    queryString = "authtoken=" + authToken
    accountsPromise = @ajax.send
      url: @baseUrl + '/bankaccounts?' + queryString
      method: 'GET'

  _onBankAccountsResponse: ->
    @bankAccounts = @ajax.lastResponse
    @$.bankAccountsStorage.save()
    return

  EncodeQueryData: (data)->
    ret = []
    for key in Object.keys data
      ret.push encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
    return ret.join("&");
