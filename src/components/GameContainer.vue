<template>
 <div>
  <header>
    <div class="row">
      <h1>Card Battle!</h1>

      <section id="game" class="row">
        <start-scene></start-scene>
        <game-scene></game-scene>
        <game-over-scene></game-over-scene>
      </section>
    </div>
  </header>
  <section class='how-to-play'>
    <h2>玩法介绍</h2>
    <p>选择任意一张牌，然后观看点数的pk结果</p>
  </section>
  <footer>
   </footer>
 </div>  
</template>

<script>
  import StartScene from './startscenecomponent'
  import GameScene from './gamescenecomponent'
  import GameOverScene from './gameovercomponent'
  export default {
    components: {
      StartScene,
      GameScene,
      GameOverScene
    }
  }
</script>

<style scoped>
  #game {
    width: 480px;
    height: 600px;
    margin: 0 auto;
    border-radius: 8px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .row {
    width: 480px;
    margin: 0 auto;
  }

  .scene {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    border-radius: 8px;
    transition: all .3s ease-out;
  }

  .scene.out {
    transform: translate3d(100%, 0, 0);
  }

  .scene.in {
    transform: translate3d(0, 0, 0)
  }


</style>