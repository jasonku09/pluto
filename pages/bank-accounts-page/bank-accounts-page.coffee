Polymer
  is: "bank-accounts-page"

  properties:
    bankAccounts:
      type: Array
      notify: true

    ready:
      notify: true

  _computeHeaderHidden: (bankAccounts)->
    return false if !bankAccounts
    return true

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
    @_getBankAccounts()
    @bankAccounts = @bankAccounts || []
    return

  _getBankAccounts: ->
    banksPromise = @$.bankAccountsController.GetBankAccounts(Parse.User.current()._sessionToken)
    self = @
    banksPromise.then (banks)->
      bankaccounts = []
      for bank in banks
        for account in bank.accounts
          switch account.institution_type
            when "amex" then account.icon = "../../resources/icons/amex.png"
            when "bofa" then account.icon = "../../resources/icons/bofa.png"
            when "chase" then account.icon = "../../resources/icons/chase.png"
            when "citi" then account.icon = "../../resources/icons/citi.jpg"
            when "usaa" then account.icon = "../../resources/icons/usaa.jpg"
            when "us" then account.icon = "../../resources/icons/usbank.png"
            when "wells" then account.icon = "../../resources/icons/wellsfargo.jpg.png"
          bankaccounts.push account

      self.bankAccounts = bankaccounts
      self.$.bankAccountsStorage.save()
      return
    , (error)->
      console.log error
      return
    return

  _addBankAccount: (token)->
    promise = @$.bankAccountsController.AddBankAccount(Parse.User.current()._sessionToken, token)
    promise.then =>
      @transactionsUpdating = @transactionsUpdating + 1 || 1
      @_startParseTimer()
      @_getBankAccounts()
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
        environment = "tartan"
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
      @parseTimeRemaining = moment(@parseFinish).diff(moment(), 'seconds') || 0
      if @parseTimeRemaining <= 0
        if @transactionsUpdating > 0
          alert("Updating Transactions...")
          promise = @$.transactionsController.UpdateTransactions(Parse.User.current()._sessionToken)
          promise.then ()=>
            @transactionsUpdating--
            if @transactionsUpdating is 0
              @ready = true
            return
          , (error)=>
            @transactionsUpdating--
            if @transactionsUpdating is 0
              setTimeout =>
                @ready = true
              , 60000
            return
        else
          @ready = true
        return
      @_timer()
      return
    , 1000
    return

  _updateTransactions: ->
    promise = @$.transactionsController.UpdateTransactions(Parse.User.current()._sessionToken)
    promise.then ()->
      alert 'success'
    , (error)->
      alert 'error' + error

  _onAddTap: ->
    @PlaidLink.open()
    return

  _onBackTap: ->
    @router.go '/home',
      data:
        accounts: @bankAccounts
