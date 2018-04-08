<template>
  <div id="game-scene" :class="{'scene in': show,
              'scene out': !show}">
        <div class="hp-background">
         <div class="hp opponent" :style="{'width':opponentHPWidth}"></div>
         <div class="hp player" :style="{'width':playerHPWidth}"></div>
        </div>
        <div class="battle-indicator"></div>
     <div class="card player a" :class="{'flipped': cardAFlipped,'out' : cardAOut, 'in': !cardAOut, 'selected': cardASelected,'shake' :cardAShake}" @click="cardAClick()">
       <div class="front face">
     		<div class="power">{{selectedCardPower}}</div>
  	   </div>
       <div class="back face"></div>
     </div>

     <div class="card player b" :class="{'flipped': cardBFlipped,'out' : cardBOut, 'in': !cardBOut, 'selected': cardBSelected,'shake' :cardBShake}" @click="cardBClick()">
       <div class="front face">
     		<div class="power">{{selectedCardPower}}</div>
  	   </div>
       <div class="back face"></div>
     </div>

     <div class="card player c" :class="{'flipped': cardCFlipped,'out' : cardCOut, 'in': !cardCOut, 'selected': cardCSelected,'shake' :cardCShake}" @click="cardCClick()">
       <div class="front face">
     		<div class="power">{{selectedCardPower}}</div>
  	   </div>
       <div class="back face"></div>
     </div>

     <div class="card opponent" :class="{'out' : cardOpponentOut, 'in': !cardOpponentOut, 'shake' :opponentCardShake}"> 
       <div class="front face">
     		<div class="power">{{selectedCardPower}}</div>
  	   </div>
       <div class="back face">back</div>
	 </div>

	 <div class="blaze toward-left" :class="{'attack' : blazeAttackLeft}"></div>
	 <div class="blaze toward-right" :class="{'attack' : blazeAttackRight}"></div>
  </div>
</template>

<script>
  import Constant from './constant'
  export default {
    data () {
      return {
        show: false,
        userWon: true,
        //选中扑克牌的能量值
        selectedCardPower: 0,
        //敌对扑克牌的能量值
        opponentCardPower: 100,
        //控制敌对扑克牌是否在页面上出现
        cardOpponentOut: true,
        opponentCardObject: null,
        selectedCardObject: null,
        blazeTowardLeftObject: null,
        blazeTowardRightObject: null,
        blazeAttackLeft: false,
        blazeAttackRight: false,
      	cardAShake: false,
      	cardBShake: false,
      	cardCShake: false,
        opponentCardShake: false,
        transitionState: '',

        cardASelected: false,
        cardBSelected: false,
        cardCSelected: false,
        cardAFlipped: false,
        cardBFlipped: false,
        cardCFlipped: false,
        cardAOut: false,
        cardBOut: false,
        cardCOut: false,

        playerHP: 100,
	    opponentHP: 100,
	    opponentHPWidth: '210px',
	    playerHPWidth: '210px',

	    someoneDead: false,
	    playerDead: false
      }
    },
    created () {
    	this.randomizerPower()
    },
    mounted () {
      Constant.Event.$on(Constant.MSG_START_SCENE, function () {
      	console.log("进入函数")
        this.show = true
        setTimeout(this.cardFlipped, 1000)
      }.bind(this)),
      this.opponentCardObject = document.querySelector('.card.opponent')
      this.blazeTowardLeftObject = document.querySelector('.blaze.toward-left')
      this.blazeTowardRightObject = document.querySelector('.blaze.toward-right')
    },
    methods: {
      showGameOverScene () {
        Constant.Event.$emit(Constant.MSG_OVER_GAME_SCENE, this.userWon)
      },
      cardFlipped () {
        this.cardAFlipped = true
        this.cardBFlipped = true
        this.cardCFlipped = true

        this.cardAOut = false
        this.cardBOut = false
        this.cardCOut = false
      },
      cardAClick () {
        this.cardASelected = true
        this.cardAFlipped = false
        this.cardBOut = true
        this.cardCOut = true

        this.beginBattleAnimation()
      },
      cardBClick () {
        this.cardBSelected = true
        this.cardBFlipped = false
        this.cardAOut = true
        this.cardCOut = true
        console.log("点击")
        this.beginBattleAnimation()
      },
      cardCClick () {
        this.cardCSelected = true
        this.cardCFlipped = false
        this.cardBOut = true
        this.cardAOut = true
        
        this.beginBattleAnimation()
      },
      randomizerPower () {
        this.selectedCardPower = Math.floor(Math.random() * 60) + 40
        var val = Math.floor(Math.random() * 50) + 50
        this.opponentCardPower = Math.floor(Math.random() * val) + 100 - val
      },
      isSomeoneDead () {
        this.someoneDead = (this.playerHP <= 0 || this.opponentHP <= 0)
      },
      isPlayerDead () {
        if (this.playerHP <= 0) {
          this.playerDead =  true
        }

        this.playerDead = false
      },
      hurtPlayer (attackPower, defensePower) {
        var diff = attackPower - defensePower
        if (diff > 0) {
          this.playerHP = Math.max(this.playerHP - diff, 0)
          this.playerHPWidth = this.playerHP / 100 * 210 + 'px'
        }
        console.log('player width:' + this.playerHPWidth)
      },
      hurtOpponent (attackPower, defensePower) {
        var diff = attackPower - defensePower
        if (diff > 0) {
          this.opponentHP = Math.max(this.opponentHP - diff, 0)
          this.opponentHPWidth = this.opponentHP / 100 * 210 + 'px'
        }
        console.log('opponent width' + this.opponentHPWidth)
      },
      beginBattleAnimation () {
      	this.handleTransitionEnd(this.opponentCardObject)
        this.transitionState = Constant.OPPONENT_CARD_TRANSITION_END
        this.cardOpponentOut = false
        
      },
      handleTransitionEnd (htmlObj) {
        var listener = function (e) {
          e.target.removeEventListener('webkitTransitionEnd', listener)
          this.handleTransitionEvent(e)
        }.bind(this)

        htmlObj.addEventListener('webkitTransitionEnd', listener)
      },
      handleAnimationEnd (htmlObj) {
        var listener = function (e) {
          e.target.removeEventListener('webkitAnimationEnd', listener)
          this.handleTransitionEvent(e)
        }.bind(this)
        console.log("handleAnimationEnd")
        htmlObj.addEventListener('webkitAnimationEnd', listener)
      },
      handleTransitionEvent (e) {
      	console.log("Event")
        switch (this.transitionState) {
          case Constant.OPPONENT_CARD_TRANSITION_END:
            if (this.cardOpponentOut === false) {
              this.transitionState = Constant.BLAZE_TOWARD_LEFT_ANIMATION_END
              this.blazeAttackLeft = true
              this.handleAnimationEnd(this.blazeTowardLeftObject)
            }
            break
          case Constant.BLAZE_TOWARD_LEFT_ANIMATION_END:
            this.handleAnimationEnd(this.opponentCardObject)
            this.opponentCardShake = true
            this.transitionState = Constant.OPPONENT_CARD_ANIMATION_END
            this.hurtOpponent(this.selectedCardPower, this.opponentCardPower)
            break
          case Constant.OPPONENT_CARD_ANIMATION_END:
            this.handleAnimationEnd(this.blazeTowardRightObject)
            this.blazeAttackRight = true
            this.transitionState = Constant.BLAZE_TOWARD_RIGHT_ANIMATION_END
            break
          case Constant.BLAZE_TOWARD_RIGHT_ANIMATION_END:
            var selectedCard = ''
            if (this.cardASelected) {
              console.log('card A shake')
              this.cardAShake = true
              selectedCard = '.card.player.a'
            } else if (this.cardBSelected) {
              this.cardBShake = true
              selectedCard = '.card.player.b'
            } else if (this.cardCSelected) {
              this.cardCShake = true
              selectedCard = '.card.player.c'
            }
            this.selectedCardObject = document.querySelector(selectedCard)
            this.handleAnimationEnd(this.selectedCardObject)
            this.hurtPlayer(this.opponentCardPower, this.selectedCardPower)
            this.transitionState = Constant.SELECTED_CARD_SHAKE_END
            break
          case Constant.SELECTED_CARD_SHAKE_END:
            if (this.someoneDead) {
              if (this.playerDead) {
                this.userWon = false
              } else {
                this.userWon = true
              }

              this.showGameOverScene()
            } else {
              this.restartGame()
            }
            break
        }
      },
      restartGame () {
        this.cardASelected = false
        this.cardBSelected = false
        this.cardCSelected = false
        this.cardOpponentOut = true
        this.transitionState = Constant.OPPONENT_CARD_TRANSITION_END
        this.blazeAttackLeft = false
        this.opponentCardShake = false
        this.blazeAttackRight = false
        this.cardAShake = false
        this.cardBShake = false
        this.cardCShake = false

        this.cardFlipped()
      }
    }
  }
</script>

<style scoped>
  #game-scene {
    background: url(../../static/images/battle-bg.png) no-repeat;
  }
  .button {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  @keyframes shake {
    0%   {transform: translate3d(0, 0, 0);}
    20%  {transform: translate3d(-5%, 0, 0);}
    40%  {transform: translate3d(5%, 0, 0);}
    60%  {transform: translate3d(-5%, 0, 0);}
    80%  {transform: translate3d(5%, 0, 0);}
    100% {transofrm: translate3d(0, 0, 0);}
  }
  .card {
    position: absolute;
    width: 140px;
    height: 180px;
    perspective: 700;
    transition: all .5s ease-out;

    bottom: 100px;
  }

  .card.a {left: 15px;}
  .card.b {left: 170px;}
  .card.c {left: 325px;}

  .card > .face {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 4px;
    backface-visibility: hidden;
    transition: all 0.5s ease-out;
  }

   .card > .face.front {
    background: #81d1e9 url(../../static/images/front-face.png);
    transform: rotate3d(0, 1, 0, 0deg);
  }

   .card > .face.back {
    background: #4474b5 url(../../static/images/back-face-pattern.png);
    transform: rotate3d(0, 1, 0, 180deg);
    border: 3px solid white;
  }

   .card.flipped > .face.front {
    transform: rotate3d(0, 1, 0, -180deg);
  }

   .card.flipped > .face.back {
    transform: rotate3d(0, 1, 0, 0deg);
  }

   .card.player.out {
    transform: translate3d(0, 180%, 0);
  }

  .card.player.in {
    transform: translate3d(0, 0, 0);
  }

  .card.player.flipped {
    cursor: pointer;
  }

  .card.player.in.flipped:hover {
    transform: translate3d(0, -10px, 0);
  }

  .card.selected {
    bottom: 250;
    left: 300px;
  }
  .card.opponent.out {
    transform: translate3d(0, 180%, 0);
  }

  .card.opponent.in {
    transform: translate3d(0, 0, 0);
  }

  .card.shake{animation: shake 300ms ease-out}
  .blaze {
    position: absolute;
    bottom: 200px;
    width: 50px;
    height: 50px;
    opacity: 0;
    animation-timing-function: ease-out;
    animation-duration: 1000ms;
  }

  .blaze.toward-left {background-image: url(../../static/images/blaze-left.png);}
  .blaze.toward-right {background-image: url(../../static/images/blaze-right.png);}

  @keyframes blaze-toward-left {
  0%, 20% {opacity: 1; transform: translate3d(300px, 0, 0)}
  80% {transform: translate3d(100px, 0, 0);}
  100% {opacity: 0; transform: translate3d(100px, 0, 0);}
  }
  @keyframes blaze-toward-right {
  0%, 20% {opacity: 0; transform: translate3d(100px, 0, 0);}
  80% {transform: translate3d(100px, 0, 0);}
  100% {opacity: 1; transform: translate3d(300px, 0, 0)}
  }

  .blaze.toward-left.attack {animation-name: blaze-toward-left;}
  .blaze.toward-right.attack {animation-name: blaze-toward-right;}

  .battle-indicator {
    position: absolute;
    width: 80px;
    height: 80px;
    top: 0;
    left: 200px;
    background: url(../../static/images/battle.png)
  }
  .hp-background {
    border-bottom: 1px solid #333;
    background: #ababab;
    height: 30px;
  }
  .hp {
    position: absolute;
    width: 210px;
    height: 30px;
    transition: all .3s ease-out;
  }

  .hp.opponent {
    background: url(../../static/images/blue-hp.png) repeat;
    left: 0;
  }
  .hp.player {
    background: url(../../static/images/red-hp.png) repeat;
    right: 0;
  }
  .card .power {
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 30px;
    font-size: 2em;
    color: #fff
  }
</style>