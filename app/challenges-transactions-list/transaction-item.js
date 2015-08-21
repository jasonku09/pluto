(function() {
  Polymer({
    is: 'transaction-item',
    properties: {
      currentPosition: {
        type: Number
      }
    },
    _computeDateStyle: function(active) {
      if (active) {
        return 'background-color: #B3E1E4';
      } else {
        return '';
      }
    },
    _computeSwipeText: function(transaction) {
      if (transaction.category[0] === "Food and Drink") {
        return "Not Food";
      } else {
        return "Food";
      }
    },
    attached: function() {
      this.setScrollDirection('y', this.$.item);
      this.currentPosition = 0;
    },
    Close: function() {
      this.currentPosition = 0;
      this.$.item.style.marginLeft = '0';
      this.$.item.style.marginRight = '0';
    },
    _formatDate: function(transaction) {
      return moment(transaction.timestamp).format('M/D');
    },
    _formatAmount: function(amount) {
      return amount.toFixed(2);
    },
    _handleTrack: function(e) {
      var newPosition;
      switch (e.detail.state) {
        case 'start':
          console.log('tracking started!');
          break;
        case 'track':
          newPosition = this.currentPosition + e.detail.ddx;
          if (newPosition > 0) {
            return;
          } else {
            this.$.item.style.marginLeft = newPosition + 'px';
            this.$.item.style.marginRight = -newPosition + 'px';
            this.currentPosition = newPosition;
          }
          break;
        case 'end':
          this.$.item.classList.add('transition');
          if (this.currentPosition < -50) {
            this.currentPosition = -100;
            this.$.item.style.marginLeft = '-100px';
            this.$.item.style.marginRight = '100px';
          } else {
            this.Close();
          }
          setTimeout((function(_this) {
            return function() {
              return _this.$.item.classList.remove('transition');
            };
          })(this), 400);
      }
    },
    _onDateTap: function() {
      this.fire('date-change', {
        objectId: this.transaction.objectId
      });
    },
    _onCategorizeTap: function() {
      var newCategory;
      if (this.transaction.category[0] === "Food and Drink") {
        newCategory = ["Other"];
      } else {
        newCategory = ["Food and Drink"];
      }
      this.set('transaction.category', newCategory);
      this.fire('category-change', {
        objectId: this.transaction.objectId,
        newCategory: newCategory
      });
      this.Close();
    }
  });

}).call(this);
