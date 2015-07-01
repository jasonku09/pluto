Polymer
  is: "goal-add"

  behaviors:[
    Polymer.NeonAnimatableBehavior
    Polymer.NeonAnimationRunnerBehavior
  ]

  properties:
    sharedElements:
      value: ->
        'ripple' : @$.fixed
        'hero': @$.toolbar
        'hero2': @$.main
        'ripple2': @$.fixedtwo

    animationConfig:
      type: Object
      value: ->
        'entry': [
          name: 'ripple-animation'
          id: 'ripple'
          toPage: @
        ,
          name: 'ripple-animation'
          id: 'ripple2'
          toPage: @
        ,
          name: 'fade-in-animation'
          node: @$.panel
          timing: {
            duration: 1000
            delay: 600
            easing: "cubic-bezier(0.000, 0.785, 0.530, 0.960)"
          }
        ]
        'exit':[
          name: 'fade-out-animation'
          node: @$.fixed
        ,
          name: 'fade-out-animation'
          node: @$.fixedtwo
        ,
          name: 'scale-down-animation',
          transformOrigin: '90% 75%'
          node: @$.panel
          timing:{
            duration: 800
            easing: "cubic-bezier(0.465, 0.000, 0.005, 1.060)"
          }
        ,
          name: 'fade-out-animation'
          node: @$.panel
          timing: {
            duration: 800
            easing: "cubic-bezier(0.465, 0.000, 0.005, 1.060)"
          }
        ]

  _onBackTap: ->
    @fire 'close'
    @fire 'iron-signal', {name: "raise"}
