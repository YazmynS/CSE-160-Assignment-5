import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { createCamera } from './src/camera.js'; 
import { createLight } from './src/light.js';

function main() {
    // Initialize Renderer
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

    //Initilize Scene
    const scene = new THREE.Scene();
    const { camera, controls } = createCamera(renderer);
    createLight(scene);

    //Initialize Fog
    scene.fog = new THREE.Fog(0x999999, 0.5, 3); 

    //Initialize Skybox
    const skyLoader = new THREE.TextureLoader();
    const skyTexture = skyLoader.load(
        'bg.jpg',
        () => {
            skyTexture.mapping = THREE.EquirectangularReflectionMapping;
            skyTexture.colorSpace = THREE.SRGBColorSpace;
            scene.background = skyTexture;
        }
    );

    // Load Block Texture 
    const loader = new THREE.TextureLoader();
    const trunkText = loader.load('trunk.png');
    const leafText = loader.load('leaves.png');
    const ropeText = loader.load('rope.png');

    //Load House Model
    const houseTexture = loader.load('house.png');
    const mtlLoader = new MTLLoader();
    mtlLoader.load('house.mtl', (materials) => {
        materials.preload();
        
        // Position House
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('house.obj', (object) => {
            object.scale.set(0.1, 0.1, 0.1);
            object.position.set(0, -0.5, -2);
        
            object.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshPhongMaterial({ map: houseTexture });
                    // Use Shadows
                    child.castShadow = true;  
                    child.receiveShadow = true; 
                }
            });
            scene.add(object);
        });   
    });

    // Ground
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 }); // Transparent to only show shadows
    const ground = new THREE.Mesh(planeGeometry, planeMaterial);
    ground.rotation.x = (-Math.PI / 2)+3; // Rotate flat
    ground.position.y = -1;  // Adjust to match scene ground level
    ground.receiveShadow = true;
    scene.add(ground);
    ground.receiveShadow = true;
 
    // Cube geometry
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const cubeGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const ropeGeometry = new THREE.BoxGeometry(4, .1, .1); // Tall rectangular cylinder
    const cylinderGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 32); // Radius top, Radius bottom, Height, Radial segments
    const sphereGeometry = new THREE.SphereGeometry(1, 64, 64); // Sphere with radius 0.5

    // Create Shapes
    function makeInstance(geometry, color, x, y, z, texture = null) {
        let material;
        if (texture) { material = new THREE.MeshBasicMaterial({ map: texture }); } 
        else { material = new THREE.MeshPhongMaterial({ color }); }

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cube.position.set(x, y, z);
        cube.castShadow = true;
        cube.receiveShadow = true;
        return cube;
    }

        const leafCube = makeInstance(sphereGeometry, 0x44aa88, -2, 2, 3, leafText);
        const trunkCube = makeInstance(cylinderGeometry, 0x8844aa, -2, 1, 3, trunkText);
        const leafCube2 = makeInstance(sphereGeometry, 0x44aa88, 2, 2, 3, leafText);
        const trunkCube2 = makeInstance(cylinderGeometry, 0x8844aa, 2, 1, 3, trunkText);
        const sunCube = makeInstance(cubeGeometry, 0xaa8844, 2,1,0);
        const ropeCube = makeInstance(ropeGeometry, 0x8844aa, 0, 0, 3, ropeText);

        trunkCube.castShadow = true;
        trunkCube.receiveShadow = true;

    // Render Scene Function
    function render(time) {
        time *= 0.001; 
        
        // Sun Animation
        sunCube.rotation.x += 0.02; 
        sunCube.rotation.y += 0.02;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    // Call All Functions
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

main();
