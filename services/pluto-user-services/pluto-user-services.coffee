Polymer
  is: "pluto-user-services"

  properties:
    user:
      type: Object

  attached: ->
    @clientID = "test_id"#PlutoMetadata.CoreProAPI.ClientID
    @secret = "test_secret"#PlutoMetadata.CoreProAPI.Secret

  AddAccount: (publicToken)->
    promise = @controller.ExchangeToken publicToken
    promise.then (result)->
      alert result
    , (error)=>
      alert error

  _onAddAccountSuccess: ->
    # Add Account to Parse.User's list of accounts
    BankAccounts = Parse.Object.extend("BankAccounts")
    query = new Parse.Query(BankAccounts)
    query.equalTo("user", @user)
    query.find
      success: (result)->
        return result.accounts
    ,
      error: (error)=>
        return error.message
