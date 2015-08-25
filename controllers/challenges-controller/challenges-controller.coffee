Polymer
  is: 'challenges-controller'

  CreateNewChallenge: (maxSpend, averageSpend, savePercentage)->
    Challenge = Parse.Object.extend("Challenge")
    newChallenge = new Challenge()
    newACL = {}
    newACL[Parse.User.current().id] = {
      "read": true
      "write": true
    }
    newChallenge.setACL newACL
    if moment().weekday() is 0
      startDay = 7
    else startDay = moment().weekday()
    promise = newChallenge.save
      week: new Date(moment().weekday(1))
      max_spend: maxSpend
      average_spending: averageSpend
      save_percentage: savePercentage
      start_day: startDay
      userId: Parse.User.current().get('username')
      status: 'In Progress'

  CreateNewGoal: (name, amount)->
    Goal = Parse.Object.extend("Goal")
    newGoal = new Goal()
    newACL = {}
    newACL[Parse.User.current().id] = {
      "read": true
      "write": true
    }
    newGoal.setACL newACL
    promise = newGoal.save
      name: name
      amount: parseInt amount
      saved: 0
