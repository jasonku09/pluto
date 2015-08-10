Polymer
  is: "bank-accounts-page"

  properties:
    bankAccounts:
      type: Array
      notify: true

    ready:
      notify: true

  _computeLoaderHidden: (parseTimeRemaining, parseFinish)-> !moment().isBefore(@parseFinish)

  _computeProgressValue: (parseTimeRemaining)->
    return (moment.duration(5, 'minutes').asSeconds() - parseTimeRemaining) / moment.duration(5, 'minutes').asSeconds() * 100

  _computeAddText: (bankAccounts)->
    if !bankAccounts || bankAccounts.length is 0
      return "Add account"
    else return "Add another account"

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

  _getAccountName: (account)-> account.meta.name + " (" + account.meta.number + ")"

  _getAccountBalance: (account)-> '$' + account.balance.current

  _formatAmount: (amount)-> '$ ' + amount

  attached: ->
    @ready = false
    @_createPlaidLink()
    @_timer()
    @bankAccounts = @bankAccounts || []
    if @bankAccounts.length > 0 && moment().isAfter(@parseFinish)
      @ready = true
    return

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
        self._startParseTimer()
        self._onRefreshTap()
        return
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

  _startParseTimer: ->
    @ready = false
    @parseFinish = moment().add(5, 'minutes')
    @_timer()
    return

  _timer: ->
    setTimeout =>
      @parseTimeRemaining = moment(@parseFinish).diff(moment(), 'seconds')
      if @parseTimeRemaining < 0
        @ready = true
        return
      @_timer()
      return
    , 1000

  _onAddTap: ->
    @PlaidLink.open()
    return

  _onBackTap: ->
    @router.go '/home',
      data:
        accounts: @bankAccounts
