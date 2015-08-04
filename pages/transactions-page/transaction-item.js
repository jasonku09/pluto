(function() {
  Polymer({
    is: 'transaction-item',
    properties: {
      currentPosition: Number
    },
    attached: function() {
      this.setScrollDirection('y', this.$.item);
      this.currentPosition = 0;
    },
    _formatAmount: function(amount) {
      return amount.toFixed(2);
    },
    _handleTrack: function(e) {
      switch (e.detail.state) {
        case 'start':
          return console.log('tracking started!');
        case 'track':
          this.$.item.style.marginLeft = (this.currentPosition + e.detail.ddx) + 'px';
          this.currentPosition += e.detail.ddx;
          return console.log('Tracking in progress...' + e.detail.x + ', ' + e.detail.y);
        case 'end':
          return console.log('Tracking ended');
      }
    }
  });

}).call(this);
