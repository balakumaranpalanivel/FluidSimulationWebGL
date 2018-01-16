function initThreeScene(){

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(
        window.innerWidth / -2,
        window.innerWidth / 2,
        window.innerHeight / -2,
        window.innerHeight / 2,
        -10, 100
    );
    var renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});

    init();

    function init(){
        var container = $("threeContainer");
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.append(renderer.domElement);

        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(100, 0, 100);
        scene.add(directionalLight);

        var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        camera.up = new THREE.Vector3(0,0,1);
        camera.zoom = 1;
        camera.updateProjectionMatrix();
        camera.position.z = 10;

        renderer.setClearColor(0x000000, 0);

        render();
    }

    function render()
    {
        renderer.render(scene, camera);
    }

    return {
        render: render,
        scene: scene,
        camera: camera
    }
}