(function() {
  Polymer({
    is: 'bank-accounts-controller',
    ready: function() {
      if (PlutoMetadata.Environment === "Production") {
        this.baseUrl = 'https://pluto-io.appspot.com';
      } else {
        this.baseUrl = "http://localhost:3000";
      }
    },
    AddBankAccount: function(authToken, publicToken) {
      var body, promise;
      body = this.EncodeQueryData({
        authtoken: authToken,
        publictoken: publicToken
      });
      return promise = this.$.ajax.send({
        url: this.baseUrl + '/bankaccounts/add',
        method: 'POST',
        body: body,
        contentType: 'application/x-www-form-urlencoded'
      });
    },
    GetBankAccounts: function(authToken) {
      var accountsPromise, queryString;
      queryString = "authtoken=" + authToken;
      return accountsPromise = this.$.ajax.send({
        url: this.baseUrl + '/bankaccounts?' + queryString,
        method: 'GET'
      });
    },
    _onBankAccountsResponse: function() {
      this.bankAccounts = this.$.ajax.lastResponse;
      this.$.bankAccountsStorage.save();
    },
    EncodeQueryData: function(data) {
      var i, key, len, ref, ret;
      ret = [];
      ref = Object.keys(data);
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        ret.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
      }
      return ret.join("&");
    }
  });

}).call(this);
