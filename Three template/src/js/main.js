import LoadingComponent from './components/LoadingComponent';
import ManagerComponent from './components/ManagerComponent';
import "../style/app.scss";

let loadingComponent = new LoadingComponent();
let managerComponent = new ManagerComponent();

VSDK.onRequestInitGame((callback) => {
    loadingComponent.loadAssets().then(() => {
        managerComponent.setup(loadingComponent.getModels(), loadingComponent.getTextures());
    })
    callback();
});

VSDK.onRequestCreateGame((screenSize, callback) => {          
    managerComponent.createLevel();
    callback();
})

VSDK.onRequestStartGame((callback) => {
    managerComponent.start();
    callback();
});

VSDK.onRequestPauseGame((_paused) => {
    managerComponent.pause();
    });
 
VSDK.onRequestResizeGame((screenSize, callback) => {
    managerComponent.resize();
    callback();
});









