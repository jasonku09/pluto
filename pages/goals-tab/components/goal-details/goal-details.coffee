Polymer
  is: 'goal-details'

  behaviors:[
    Polymer.NeonAnimatableBehavior
    Polymer.NeonAnimationRunnerBehavior
  ]

  properties:
    sharedElements:
      type: Object
      value: ->
        'hero': @$.main

    animationConfig:
      type: Object
      value: ->
        'entry': [
          name: 'hero-animation'
          id: 'hero'
          toPage: @
        ]
        'exit':[
          name: 'scale-down-animation'
          node: @$.main
          transformOrigin: '50% 50%'
          axis: 'y'
        ]

  _onBackTap: ->
    @fire 'close'
