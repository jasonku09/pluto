(function() {
  Polymer({
    is: "feed-tab",
    properties: {
      feedtemp: {
        type: Array,
        value: [
          {
            name: "Thomas E.",
            timestamp: "June 6th 2015 5:35 PM",
            description: "Saved 15$ towards Coachella Ticket",
            avatar: "../../resources/icons/default_profile.png"
          }, {
            name: "Thomas E.",
            timestamp: "June 6th 2015 5:35 PM",
            description: "Saved 15$ towards Coachella Ticket",
            avatar: "../../resources/icons/default_profile.png"
          }, {
            name: "Thomas E.",
            timestamp: "June 6th 2015 5:35 PM",
            description: "Saved 15$ towards Coachella Ticket",
            avatar: "../../resources/icons/default_profile.png"
          }, {
            name: "Thomas E.",
            timestamp: "June 6th 2015 5:35 PM",
            description: "Saved 15$ towards Coachella Ticket",
            avatar: "../../resources/icons/default_profile.png"
          }, {
            name: "Thomas E.",
            timestamp: "June 6th 2015 5:35 PM",
            description: "Saved 15$ towards Coachella Ticket",
            avatar: "../../resources/icons/default_profile.png"
          }, {
            name: "Thomas E.",
            timestamp: "June 6th 2015 5:35 PM",
            description: "Saved 15$ towards Coachella Ticket",
            avatar: "../../resources/icons/default_profile.png"
          }, {
            name: "Thomas E.",
            timestamp: "June 6th 2015 5:35 PM",
            description: "Saved 15$ towards Coachella Ticket",
            avatar: "../../resources/icons/default_profile.png"
          }, {
            name: "Thomas E.",
            timestamp: "June 6th 2015 5:35 PM",
            description: "Saved 15$ towards Coachella Ticket",
            avatar: "../../resources/icons/default_profile.png"
          }
        ]
      }
    },
    _onUserReturn: function() {
      var i, index, len, ref, user;
      ref = this.users;
      for (index = i = 0, len = ref.length; i < len; index = ++i) {
        user = ref[index];
        this.feedtemp[index].avatar = user.picture.medium;
        this.feedtemp[index].name = user.name.first + " " + user.name.last.slice(0, 1) + ".";
      }
      this.feed = this.feedtemp;
    }
  });

}).call(this);
