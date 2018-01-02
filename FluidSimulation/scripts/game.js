var game = (function() {

    "use strict";

    Physijs.scripts.worker = 'deps/physijs_worker.js';
    Physijs.scripts.ammo = 'ammo.js';


    var scene = new Physijs.Scene(),
        camera,
        clock = new THREE.Clock(),
        renderer = new THREE.WebGLRenderer(),
        width = window.innerWidth,
        height = window.innerHeight - 10,
        playerBox,
        playerActive = true,
        lives = 3,
        controls;

    renderer.setSize(width, height);
    renderer.setClearColor(0xE0EEEE);
    
    document.getElementById("webgl-container").
                    appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(
        35,
        width/height,
        1,
        1000
    );

    scene.add(camera);
    scene.fog = new THREE.Fog(0xE0EEEE, 250, 600);
    scene.setGravity(new THREE.Vector3(0, -100, 0));

    function initScene() {
        resetScene();
        pointerLock.init(camera, scene);
        sceneSetup.addSceneObjects();
        enemy.init();
        player.createPlayer();
        gameControls.init();

        render();
    }

    function resetScene(){
        camera.position.set(0, 20, 200);
        camera.rotation.set(0, 0, 0);
    }

    function removeLife(){
        lives -= 1;
        document.getElementById("numberOfLives").innerHTML = lives;

        if(lives == 0){
            alert('game over');
        }
    }

    function render() {
        scene.simulate();

        var delta = clock.getDelta();
        enemy.update(delta);

        if (game.wintext) {
            game.wintext.rotation.y += 0.01;
        }

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    return{
        scene: scene,
        camera: camera,
        initScene: initScene,
        resetScene: resetScene,
        controls: controls,
        playerActive: playerActive,
        lives: lives,
        removeLife: removeLife,
        playerBox: playerBox
    }

})();

window.onload = game.initScene();