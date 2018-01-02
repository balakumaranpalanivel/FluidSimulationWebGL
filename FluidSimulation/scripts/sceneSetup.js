var sceneSetup = (function(){

    "use strict";

    var treeTexutre = new THREE.TextureLoader().load(
         'content/tree.jpg' );

    function createRoad(zPos){
        var road = new THREE.Mesh(
            new THREE.BoxGeometry(2000, 1, 250),
            new THREE.MeshLambertMaterial(
                {map: new THREE.TextureLoader().load('content/road.jpg')}),
                0
        );

        road.name = "road";
        road.position.y = 1;
        road.position.z = zPos;
        game.scene.add(road);
    }

    function createLake(zPos){
        var lake = new THREE.Mesh(
            new THREE.BoxGeometry(2000, 1, 250),
            new THREE.MeshLambertMaterial(
                {map: new THREE.TextureLoader().load('content/water.jpg')}),
                0
        );

        lake.name = "lake";
        lake.position.y = 1;
        lake.position.z = zPos;
        game.scene.add(lake);
    }

    function createTree(x, z){
        var treeBaseWidth = support.getRand(15, 22);

        var tree = new THREE.Mesh(
            new THREE.CylinderGeometry(1, treeBaseWidth, 60, 9, 9, false),
            new THREE.MeshLambertMaterial(
                {ambient:0x003311 * support.getRand(0, 5),
                map: treeTexutre}),
                0
        );

        var stump = new THREE.Mesh(
            new THREE.CylinderGeometry(5, 5, 20, 9, 9, false),
            new THREE.MeshLambertMaterial({ambient: 0x552211}),
            0
        );

        tree.add(stump);
        stump.position.y = -40;

        tree.name = "tree";
        tree.position.set(x, 40, z);

        game.scene.add(tree);
    }

    function addSceneObjects(){

        // ground
        var grassTexture = new THREE.TextureLoader().load(
            'content/grass.png');
        grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
        grassTexture.repeat.set(25, 25);

        var material = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({map:grassTexture}),
            0.9,
            0.1
        );

        var ground = new Physijs.BoxMesh(
            new THREE.BoxGeometry(2000, 1, 2000),
            material,
            0
        );

        ground.name = "ground";
        ground.position.y = 0;
        game.scene.add(ground);

        // first road
        createRoad(-100);

        // trees
        for (var i=0; i<20; i++){
            createTree(support.getRand(-500, 500),
                support.getRand(-250, -320));
        }

        // second road
        createRoad(-500);

        // lake
        createLake(-900);

        setupSceneLighting();
    }

    function setupSceneLighting(){
        
        var ambientLight = new THREE.AmbientLight(0xcccccc);
        game.scene.add(ambientLight);

        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(0, 200, -50);
        game.scene.add(spotLight);
    }

    return {
        addSceneObjects: addSceneObjects
    }

})();