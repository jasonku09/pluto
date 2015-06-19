(function() {
  Polymer({
    is: "goal-list",
    behaviors: [Polymer.NeonAnimatableBehavior, Polymer.NeonAnimationRunnerBehavior],
    properties: {
      selected: {
        type: Object,
        notify: true
      },
      animationConfig: {
        type: Object,
        value: function() {
          return {
            'entry': [
              {
                name: 'cascaded-animation',
                animation: 'fade-in-animation',
                nodes: document.getElementsByClassName("goal-item"),
                nodeDelay: 20
              }, {
                name: 'cascaded-animation',
                animation: 'scale-up-animation',
                nodes: document.getElementsByClassName("goal-item"),
                nodeDelay: 20
              }
            ],
            'test': [
              {
                name: 'fade-out-animation',
                nodes: document.getElementsByClassName("goal-item")
              }
            ],
            'exit': [
              {
                name: 'hero-animation',
                id: 'hero',
                fromPage: this
              }, {
                name: "fade-out-animation",
                node: this.$.main
              }
            ]
          };
        }
      }
    },
    listeners: {
      'neon-animation-finish': '_onNeonAnimationFinish'
    },
    _computeGoalsToolbarStyle: function(goalsCollapseOpen) {
      if (goalsCollapseOpen) {
        return 'border-left: none; background: #56CCC2 !important; color: white';
      } else {
        return 'border-left: 5px solid #39d2bb; background: white !important; color: black;';
      }
    },
    _computeGoalsCollapseIcon: function(goalsCollapseOpen) {
      if (goalsCollapseOpen) {
        return 'expand-more';
      } else {
        return 'chevron-right';
      }
    },
    _computeSavingsToolbarStyle: function(savingsCollapseOpen) {
      if (savingsCollapseOpen) {
        return 'border-left: none; background: #56CCC2 !important; color: white';
      } else {
        return 'border-left: 5px solid #39d2bb; background: white !important; color: black;';
      }
    },
    _computeSavingsCollapseIcon: function(savingsCollapseOpen) {
      if (savingsCollapseOpen) {
        return 'expand-more';
      } else {
        return 'chevron-right';
      }
    },
    attached: function() {
      this.savingsCollapseOpen = false;
      this.goalsCollapseOpen = false;
      this.goals = [
        {
          name: "Coachella Ticket",
          saved: 37,
          total: 400,
          image: "../../../../resources/images/coachella.jpg"
        }, {
          name: "Macbook Pro",
          saved: 76,
          total: 1300,
          image: "../../../../resources/images/macbook.jpg"
        }, {
          name: "Emergency Fund",
          saved: 5,
          total: 1300,
          image: "../../../../resources/images/emergency-fund.jpg"
        }, {
          name: "Birthday Gift",
          saved: 45,
          total: 1300,
          image: "../../../../resources/images/birthday-gift.jpg"
        }, {
          name: "New Shoes",
          saved: 98,
          total: 1300,
          image: "../../../../resources/images/shoes.jpg"
        }
      ];
      return this.playAnimation('entry');
    },
    _onItemTap: function(e) {
      var target;
      this.selected = this.$['goals-list'].itemForElement(e.target);
      target = event.target;
      while (!target === this && !target._templateInstance) {
        target = target.parent;
      }
      this.sharedElements = {
        'hero': target
      };
      this.fire('item-click');
    },
    _toggleSavingsPane: function() {
      var collapse;
      collapse = this.$['savingsCollapse'];
      collapse.toggle();
      if (collapse.opened) {
        this.savingsCollapseOpen = true;
        this.$.savingsToolbar.elevation = 0;
      } else {
        this.savingsCollapseOpen = false;
        this.$.savingsToolbar.elevation = 1;
      }
    },
    _toggleGoalsList: function() {
      var collapse;
      if (this.animating) {
        return;
      }
      collapse = this.$['goalsCollapse'];
      collapse.toggle();
      if (collapse.opened) {
        this.goalsCollapseOpen = true;
        this.$.goalsToolbar.elevation = 0;
        this.animating = true;
        this.playAnimation('entry');
      } else {
        this.goalsCollapseOpen = false;
        this.$.goalsToolbar.elevation = 1;
        this.animating = true;
        this.playAnimation('test');
      }
    },
    _onNeonAnimationFinish: function() {
      this.animating = false;
    }
  });

}).call(this);
