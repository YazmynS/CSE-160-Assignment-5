import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    const fov = 75;
    const aspect = 2; // canvas default
    const near = 0.1;
    const far = 5;

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    const scene = new THREE.Scene();
     
    const skyLoader = new THREE.TextureLoader();
    const skyTexture = skyLoader.load(
        'bg.jpg', // Make sure you have a proper equirectangular image (2:1 aspect ratio) in your project folder
        () => {
            skyTexture.mapping = THREE.EquirectangularReflectionMapping;
            skyTexture.colorSpace = THREE.SRGBColorSpace;
            scene.background = skyTexture;
        },
        undefined, // You can add a progress callback if you want
        (err) => {
            console.error('Failed to load skybox texture:', err);
        }
    );
    
    const loader = new THREE.TextureLoader();
    const texture = loader.load('block.png');
    const houseTexture = loader.load('house.png');

    const mtlLoader = new MTLLoader();
    mtlLoader.load('house.mtl', (materials) => {
        materials.preload();

        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);

        objLoader.load('house.obj', (object) => {
            object.scale.set(0.1, 0.1, 0.1);
            object.position.set(0, -0.5, -2);

            // Apply houseTexture to all meshes
            object.traverse((child) => {
                if (child.isMesh) {
                    console.log('Mesh material:', child.material);
                    child.material = new THREE.MeshPhongMaterial({ map: houseTexture });
                }
            });

            scene.add(object);
        });
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(-1, 2, 4);
    scene.add(directionalLight);

    const spotLight = new THREE.SpotLight(0xffffff, 50);
    spotLight.position.set(0, 5, 2); // Above and slightly in front of the scene
    spotLight.angle = Math.PI / 16;
    spotLight.penumbra = 0.3;
    spotLight.decay = 2;
    spotLight.distance = 20;

    // Point at the center of the scene
    spotLight.target.position.set(0, 0, 0);
    scene.add(spotLight);
    scene.add(spotLight.target);  // <-- You need to add the target to the scene too!

    // Cube geometry
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    function makeInstance(geometry, color, x, texture = null) {
        let material;
        if (texture) {
            material = new THREE.MeshBasicMaterial({ map: texture });
        } else {
            material = new THREE.MeshPhongMaterial({ color });
        }

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cube.position.x = x;
        return cube;
    }

    const cubes = [
        makeInstance(geometry, 0x44aa88, 0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844, 2, texture),
    ];

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.target.set(0, 0, 0);
    controls.update();

    function render(time) {
        time *= 0.001; // convert time to seconds
        cubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * 0.1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

main();
