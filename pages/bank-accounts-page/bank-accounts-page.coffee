Polymer
  is: "bank-accounts-page"

  properties:
    bankAccounts:
      type: Array
      notify: true

  _computeAddText: (bankData)->
    if bankData.length is 0
      return "Add account"
    else return "Add another account"

  _computeIconColor: (color)->
    return 'color:' + color

  _computeChartHidden: (bankData)->
    if bankData.length is 0
      return true
    else return false

  _computeTotalAssets: (bankAccounts)->
    return if !bankAccounts
    total = 0
    for account in bankAccounts
      if account.type is 'depository'
        total += parseInt account.balance.current
      else
        total -= parseInt account.balance.current
    return '$ ' + total

  _getCashAccounts: (bankAccounts)->
    return if !bankAccounts
    cashAccounts = []
    for account in bankAccounts
      if account.type is "depository"
        cashAccounts.push account
    cashAccounts

  _getCreditAccounts: (bankAccounts)->
    return if !bankAccounts
    creditAccounts = []
    for account in bankAccounts
      if account.type is "credit"
        creditAccounts.push account
    creditAccounts

  _getAccountName: (account)->
    return account.meta.name + " (" + account.meta.number + ")"

  _getAccountBalance: (account)->
    return '$' + account.balance.current

  attached: ->
    @bankAccounts = @bankAccounts || []
    @_setChartData()
    @_createPlaidLink()
    return

  _formatAmount: (amount)->
    return '$ ' + amount

  _onRefreshTap: ->
    banksPromise = @$.bankAccountsController.GetBankAccounts(@$.user.GetSessionToken())
    self = @
    banksPromise.then (banks)->
      bankaccounts = []
      for bank in banks
        for account in bank.accounts
          bankaccounts.push account

      self.bankAccounts = bankaccounts
      self.$.bankAccountsStorage.save()
      return
    , (error)->
      console.log error
      return
    return

  _addBankAccount: (token)->
    if PlutoMetadata.Environment is "Test"
      promise = @$.bankAccountsController.AddBankAccount(@$.user.GetSessionToken(), token)
      self = this
      promise.then ->
        self._onRefreshTap()
        return
    else
      amount = Math.random() * 10000
      if token.indexOf('chase') > -1
        name = "Chase"
        color = 'rgb(5, 82, 212)'
      else if token.indexOf('bofa') > -1
        name = "Bank of America"
        color = 'rgb(1, 62, 196)'
      else if token.indexOf('wells') > -1
        name = "Wells Fargo"
        color = 'rgb(185, 0, 0)'
      else if token.indexOf('citi') > -1
        name = "Citi"
      else if token.indexOf('us') > -1
        name = "US Bank"
      else if token.indexOf('usaa') > -1
        name = "USAA"
      else if token.indexOf('amex') > -1
        name = "American Express"
      newBankAccount = {
        name: name
        amount: amount.toFixed(2)
        color: color
      }
      tempArray = []
      for account in @bankAccounts
        tempArray.push account
      tempArray.push newBankAccount
      @bankAccounts = tempArray
      @_setChartData()
    return

  _createPlaidLink: ->
    environment = ''
    key = ''
    switch PlutoMetadata.Environment
      when "Dev"
        environment = "tartan"
        key = "test_key"
      when "Test"
        environment = "tartan"
        key = "20f7a7d661059ee02a9f9825c7767a"
      when "Production"
        environment = "production"
        key = "20f7a7d661059ee02a9f9825c7767a"

    @PlaidLink = Plaid.create
      env: environment
      clientName: "Pluto"
      key: key
      product: "connect"
      onSuccess: (token)=>
        @_addBankAccount(token)
        @_createPlaidLink()
        return

  _setChartData: ->
    dataArray = []
    for account in @bankAccounts
      dataArray.push
        label: account.name
        value: account.amount
        color: account.color
    @bankData = dataArray
    return

  _onAddTap: ->
    @PlaidLink.open()
    return

  _onBackTap: ->
    @router.go '/home',
      data:
        accounts: @bankAccounts
