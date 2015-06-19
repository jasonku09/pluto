(function() {
  Polymer({
    is: 'goal-details',
    behaviors: [Polymer.NeonAnimatableBehavior, Polymer.NeonAnimationRunnerBehavior],
    properties: {
      sharedElements: {
        type: Object,
        value: function() {
          return {
            'hero': this.$.main
          };
        }
      },
      animationConfig: {
        type: Object,
        value: function() {
          return {
            'entry': [
              {
                name: 'hero-animation',
                id: 'hero',
                toPage: this
              }
            ],
            'exit': [
              {
                name: 'scale-down-animation',
                node: this.$.main,
                transformOrigin: '50% 50%',
                axis: 'y'
              }
            ]
          };
        }
      }
    },
    _onBackTap: function() {
      return this.fire('close');
    }
  });

}).call(this);
