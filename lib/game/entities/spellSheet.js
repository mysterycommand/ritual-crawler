ig.module(
  'game.entities.spellSheet'
  )
  .requires(
    'plugins.box2d.entity'
  )
  .defines(function () {

    EntitySpellSheet = ig.Box2DEntity.extend({

      size: {x: 32, y: 32},

      killme: false,

      spell: null,
      type: ig.Entity.TYPE.B,
      checkAgainst: ig.Entity.TYPE.A,
      collides: ig.Entity.COLLIDES.PASSIVE,

      animSheet: new ig.AnimationSheet('media/scroll_fire_16.png', 32, 32),

      init: function (x, y, settings) {
        this.addAnim('idle', 1, [0]);
        this.parent(x, y, settings);
      },

      collision: {group: 'item', name: 'spellSheet', collidesWith: ['player']},
      onContact: function (initiator) {
        this.kill();

        var spellsPerScroll = 1; // Spells.length;
        for (var i = 0, len = spellsPerScroll; i < len; ++i) {
          this.assignSpell(initiator);
          this.assignCombo(this.spell, initiator);
          initiator.addToSpellBook(this.spell);
        }
      },

      assignSpell: function (player) {
        var spellsOfLevel = Spells.filter(function (spell) {
          return spell.level === 1;
        });

        var newSpellsOfLevel = spellsOfLevel.filter(function (spell){
          var knownByPlayer = (player.knownSpells.indexOf(spell) >= 0);
          if (knownByPlayer) {
            return false;
          } else {
            return true;
          }
        });


        var randomSpell = newSpellsOfLevel.random();
        this.spell = randomSpell;
        return randomSpell;
      },

      assignCombo: function (spell, player) {
        if (spell === undefined) { return; }
        var buttons = [
          {direction: 'LEFT_ACTION',   ps: 'sony/square-icon.png',    xbox: 'xbox/x-icon.png'},
          {direction: 'UP_ACTION',     ps: 'sony/triangle-icon.png',  xbox: 'xbox/y-icon.png'},
          {direction: 'RIGHT_ACTION',  ps: 'sony/circle-icon.png',    xbox: 'xbox/b-icon.png'},
          {direction: 'DOWN_ACTION',   ps: 'sony/cross-icon.png',     xbox: 'xbox/a-icon.png'}
        ];

        while (true) {
          var comboLength = 2 + spell.level;
          var combo = [];
          for (var i =0; i<comboLength; i++) {
            combo.push(buttons[Math.floor(Math.random() * buttons.length)])
          }

          if (this.comboIsUniq(combo, player)) {
            spell.combo = combo;
            break;
          }

        }
      },

      comboIsUniq(combo, player){
        var knowSpellCombosDirection = [];
        player.knownSpells.forEach((spell) => {
          knowSpellCombosDirection.push(spell.combo.map((button) => {
            return button.direction
          }))
        });

        var comboSpellDirection = combo.map((button) => {
          return button.direction;
        });

        var maybe = knowSpellCombosDirection.find((directionCombos) => {
          return directionCombos.join('') === comboSpellDirection.join('');
        });

        return undefined === maybe
      }
    });
  });
