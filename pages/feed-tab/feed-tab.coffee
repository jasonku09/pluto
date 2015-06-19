Polymer
  is: "feed-tab"

  properties:

    feedtemp:
      type: Array
      value: [
        name: "Thomas E."
        timestamp: "June 6th 2015 5:35 PM"
        description: "Saved 15$ towards Coachella Ticket"
        avatar: "../../resources/icons/default_profile.png"
      ,
        name: "Thomas E."
        timestamp: "June 6th 2015 5:35 PM"
        description: "Saved 15$ towards Coachella Ticket"
        avatar: "../../resources/icons/default_profile.png"
      ,
        name: "Thomas E."
        timestamp: "June 6th 2015 5:35 PM"
        description: "Saved 15$ towards Coachella Ticket"
        avatar: "../../resources/icons/default_profile.png"
      ,
        name: "Thomas E."
        timestamp: "June 6th 2015 5:35 PM"
        description: "Saved 15$ towards Coachella Ticket"
        avatar: "../../resources/icons/default_profile.png"
      ,
        name: "Thomas E."
        timestamp: "June 6th 2015 5:35 PM"
        description: "Saved 15$ towards Coachella Ticket"
        avatar: "../../resources/icons/default_profile.png"
      ,
        name: "Thomas E."
        timestamp: "June 6th 2015 5:35 PM"
        description: "Saved 15$ towards Coachella Ticket"
        avatar: "../../resources/icons/default_profile.png"
      ,
        name: "Thomas E."
        timestamp: "June 6th 2015 5:35 PM"
        description: "Saved 15$ towards Coachella Ticket"
        avatar: "../../resources/icons/default_profile.png"
      ,
        name: "Thomas E."
        timestamp: "June 6th 2015 5:35 PM"
        description: "Saved 15$ towards Coachella Ticket"
        avatar: "../../resources/icons/default_profile.png"
      ]
  _onUserReturn: ->
    for user, index in @users
      @feedtemp[index].avatar = user.picture.medium
      @feedtemp[index].name = user.name.first + " " + user.name.last.slice(0,1) + "."
    @feed = @feedtemp
    return
