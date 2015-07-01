(function() {
  Polymer({
    is: "goal-add",
    behaviors: [Polymer.NeonAnimatableBehavior, Polymer.NeonAnimationRunnerBehavior],
    properties: {
      sharedElements: {
        value: function() {
          return {
            'ripple': this.$.fixed,
            'hero': this.$.toolbar,
            'hero2': this.$.main,
            'ripple2': this.$.fixedtwo
          };
        }
      },
      animationConfig: {
        type: Object,
        value: function() {
          return {
            'entry': [
              {
                name: 'ripple-animation',
                id: 'ripple',
                toPage: this
              }, {
                name: 'ripple-animation',
                id: 'ripple2',
                toPage: this
              }, {
                name: 'fade-in-animation',
                node: this.$.panel,
                timing: {
                  duration: 1000,
                  delay: 600,
                  easing: "cubic-bezier(0.000, 0.785, 0.530, 0.960)"
                }
              }
            ],
            'exit': [
              {
                name: 'fade-out-animation',
                node: this.$.fixed
              }, {
                name: 'fade-out-animation',
                node: this.$.fixedtwo
              }, {
                name: 'scale-down-animation',
                transformOrigin: '90% 75%',
                node: this.$.panel,
                timing: {
                  duration: 800,
                  easing: "cubic-bezier(0.465, 0.000, 0.005, 1.060)"
                }
              }, {
                name: 'fade-out-animation',
                node: this.$.panel,
                timing: {
                  duration: 800,
                  easing: "cubic-bezier(0.465, 0.000, 0.005, 1.060)"
                }
              }
            ]
          };
        }
      }
    },
    _onBackTap: function() {
      this.fire('close');
      return this.fire('iron-signal', {
        name: "raise"
      });
    }
  });

}).call(this);
