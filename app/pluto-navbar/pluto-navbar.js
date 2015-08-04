(function() {
  Polymer({
    is: "pluto-navbar",
    properties: {
      tabs: {
        type: Object,
        value: [
          {
            name: "Feed",
            icon: 'home'
          }, {
            name: "Goals",
            icon: 'flag'
          }
        ]
      },
      tab: {
        type: String,
        observer: "_onTabChanged"
      }
    },
    attached: function() {
      if (!this.tab) {
        this.tab = "Feed";
      }
    },
    _computeIconStyle: function(item) {
      if (this.tab === item.name) {
        return 'color:white';
      } else {
        return 'color: #4b786a';
      }
    },
    _onTabChanged: function() {
      this.router.go("/" + this.tab.toLowerCase());
    }
  });

}).call(this);
