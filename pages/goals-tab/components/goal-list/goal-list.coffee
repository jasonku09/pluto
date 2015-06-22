Polymer
  is: "goal-list"

  behaviors: [
    Polymer.NeonAnimatableBehavior
    Polymer.NeonAnimationRunnerBehavior
  ]

  properties:
    selected:
      type: Object
      notify: true

    animationConfig:
      type: Object
      value: ->
        'entry':[
          name: 'cascaded-animation'
          animation: 'fade-in-animation'
          nodes: document.getElementsByClassName("goal-item")
          nodeDelay:20
        ,
          name: 'cascaded-animation'
          animation: 'scale-up-animation'
          nodes: document.getElementsByClassName("goal-item")
          nodeDelay: 20
        ]
        'test': [
          name: 'fade-out-animation'
          nodes: document.getElementsByClassName("goal-item")
        ]
        'exit': [
          name: 'hero-animation'
          id: 'hero'
          fromPage: @
        ,
          name: "fade-out-animation"
          node: @$.main
        ]

  listeners: {
    'neon-animation-finish': '_onNeonAnimationFinish'
  }

  _computeGoalsToolbarStyle: (goalsCollapseOpen)->
    if goalsCollapseOpen
      return 'border-left: none; background: #56CCC2 !important; color: white'
    else return 'border-left: 5px solid #39d2bb; background: white !important; color: black;'

  _computeGoalsCollapseIcon: (goalsCollapseOpen)->
    if goalsCollapseOpen
      return 'expand-more'
    else return 'chevron-right'

  _computeSavingsToolbarStyle: (savingsCollapseOpen)->
    if savingsCollapseOpen
      return 'border-left: none; background: #56CCC2 !important; color: white'
    else return 'border-left: 5px solid #39d2bb; background: white !important; color: black;'

  _computeSavingsCollapseIcon: (savingsCollapseOpen)->
    if savingsCollapseOpen
      return 'expand-more'
    else return 'chevron-right'


  attached: ->
    @savingsCollapseOpen = false
    @goalsCollapseOpen = false
    @goals = [
      name: "Coachella Ticket"
      saved: 37
      total: 400
      image: "../../../../resources/images/coachella.jpg"
    ,
      name: "Macbook Pro"
      saved: 76
      total: 1300
      image: "../../../../resources/images/macbook.jpg"
    ,
      name: "Emergency Fund"
      saved: 5
      total: 1300
      image: "../../../../resources/images/emergency-fund.jpg"
    ,
      name: "Birthday Gift"
      saved: 45
      total: 1300
      image: "../../../../resources/images/birthday-gift.jpg"
    ,
      name: "New Shoes"
      saved: 98
      total: 1300
      image: "../../../../resources/images/shoes.jpg"
    ]
    @playAnimation('entry')



  _onItemTap: (e)->
    @selected = @$['goals-list'].itemForElement(e.target)
    target= event.target
    while !target is @ and !target._templateInstance
      target = target.parent

    @sharedElements = {
      'hero': target
    }

    @fire 'item-click'
    return

  _toggleSavingsPane:->
    collapse = @$['savingsCollapse']
    collapse.toggle()
    if collapse.opened
      @savingsCollapseOpen = true
      @$.savingsToolbar.elevation = 0
    else
      @savingsCollapseOpen = false
      @$.savingsToolbar.elevation = 1
    return

  _toggleGoalsList:->
    return if @animating
    collapse = @$['goalsCollapse']
    collapse.toggle()
    if collapse.opened
      @goalsCollapseOpen = true
      @$.goalsToolbar.elevation = 0
      @animating = true
      @playAnimation('entry')
      context = @
      setTimeout ->
        context.$['goals-list-container'].style.display = 'block'
        return
      , 100
    else
      @goalsCollapseOpen = false
      @$.goalsToolbar.elevation = 1
      @animating = true
      @playAnimation('test')
    return


  _onNeonAnimationFinish: ->
    if !@goalsCollapseOpen
      @$['goals-list-container'].style.display = 'none'
    @animating = false
    return
