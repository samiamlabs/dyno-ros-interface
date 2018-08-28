import Phaser from 'phaser';

import MapScene from './scenes/MapScene';
import UiScene from './scenes/UiScene';

export default class NavigatorGame {
  constructor({storeState = null, useDatGui = false, actions = null, width = null, height = null}) {
    this.mapScene = new MapScene({useDatGui, storeState, actions});
    this.uiScene = new UiScene({
      zoomIn: this.mapScene.zoomIn,
      zoomOut: this.mapScene.zoomOut
    });

    var config = {
      type: Phaser.AUTO,
      parent: 'phaser-map',
      width: window.innerWidth*0.95,
      height: window.innerHeight*0.8,
      scene: [this.mapScene, this.uiScene]
    };

    this.game = new Phaser.Game(config);
  }

  destroy() {
    this.game.destroy(true);
    this.mapScene.destroy();
  }

  setStoreState(storeState) {
    this.storeState = storeState;
    this.mapScene.setStoreState(storeState);
  }

  update(time, delta) {}
}
