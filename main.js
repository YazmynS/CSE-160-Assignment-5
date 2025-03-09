import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { createCamera } from './src/camera.js'; 
import { createLight } from './src/light.js';
import { createShapeInstance } from './src/shapes.js';

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
    const skyTexture = skyLoader.load('tex/bg.jpg',() => {
        skyTexture.mapping = THREE.EquirectangularReflectionMapping;
        skyTexture.colorSpace = THREE.SRGBColorSpace;
        scene.background = skyTexture;
    });

    // Load Block Texture 
    const loader = new THREE.TextureLoader();
    const textures = {
        trunk: loader.load('tex/trunk.png'),
        leaf:  loader.load('tex/leaves.png'),
        rope: loader.load('tex/rope.png'),
        sunny: loader.load('tex/sun.jpg')
    }

    //Load House Model
    const houseTexture = loader.load('tex/house.png');
    const mtlLoader = new MTLLoader();
    mtlLoader.load('tex/house.mtl', (materials) => {
        materials.preload();
        
        // Position House
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load('tex/house.obj', (object) => {
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
        
    // Create Shapes
    const sun = createShapeInstance(scene, 'cube', 0xffcc00,
        { x: 2, y: 4, z: -1 }, 
        { x: 1, y: 1, z: 1 }, textures.sunny);
    // Remove fog and shadow from sun
    sun.material.fog = false;
    sun.castShadow = false;
    sun.receiveShadow = false;
    
    const trunk = createShapeInstance(scene, 'cylinder', 0x8B4513,
        { x: -2, y: .5, z: 4 },
        { radiusTop: 0.3, radiusBottom: 0.3, height: 2 }, textures.trunk);
    const trunk1 = createShapeInstance(scene, 'cylinder', 0x8B4513,
        { x: 2, y: .5, z: 4 },
        { radiusTop: 0.3, radiusBottom: 0.3, height: 2 }, textures.trunk);
    const leaf = createShapeInstance(scene, 'sphere', 0x44aa88,
        { x: -2, y: 2.5, z: 4 },
        { radius: 1 }, textures.leaf);
    const leaf1 = createShapeInstance(scene, 'sphere', 0x44aa88,
        { x: 2, y: 2.5, z: 4 },
        { radius: 1 }, textures.leaf);
    const rope = createShapeInstance(scene, 'prism', 0x8B4513,
        { x: 0, y: 0, z: 4 },  
        {  width: 4, height: 0.08, depth: 0.08 }, textures.rope);
   
    // Create Kid
    const humanHead = createShapeInstance(scene, 'sphere', 0xffccaa,
        { x: 0, y: 1.2, z: 4 },
        { radius: 0.2 });
    const humanBody = createShapeInstance(scene, 'cylinder', 0x0000ff,
        { x: 0, y: .8, z: 4 },
        { radiusTop: 0.2, radiusBottom: 0.25, height: .3 });
    const humanBody2 = createShapeInstance(scene, 'cylinder', 0x0000ff,
        { x: 0, y: .5, z: 4 },
        { radiusTop: 0.25, radiusBottom: 0.2, height: .3 });
    const humanLeg = createShapeInstance(scene, 'prism', 0x0000ff,
        { x: 0, y: 0.2, z: 4 },
        { width: .09, height: 0.3, depth: 0.1 });
    const humanLeg2 = createShapeInstance(scene, 'prism', 0x0000ff,
        { x: 0.15, y: .3, z: 4.1 },
        { width: .4, height: 0.09, depth: 0.1 });
    const humanArm1 = createShapeInstance(scene, 'prism', 0x0000ff,
        { x: 0, y: .8, z: 3.6 },
        { width: .09, height: 0.1, depth: 0.45 });
    const humanArm2 = createShapeInstance(scene, 'prism', 0x0000ff,
        { x: 0, y: .8, z: 4.3 },
        { width: .09, height: 0.1, depth: 0.45 });
    const humanFoot1 = createShapeInstance(scene, 'prism', 0xfffff,
        { x: -0.05, y: .1, z: 4 },
        { width: .2, height: 0.101, depth: 0.101 });
    const humanFoot2 = createShapeInstance(scene, 'prism', 0xfffff,
        { x: 0.3, y: .25, z: 4.1 },
        { width: .101, height: 0.2, depth: 0.101 });
    const humanHand1 = createShapeInstance(scene, 'sphere', 0xffccaa,
        { x: 0, y: .8, z: 3.4 },
        { radius: 0.1 });
    const humanHand2 = createShapeInstance(scene, 'sphere', 0xffccaa,
        { x: 0, y: .8, z: 4.5 },
        { radius: 0.1 });
    
    // Make Cloud 
    const cloudCenter = createShapeInstance(scene, 'sphere', 0xffffff,
        { x: 1, y: 3, z: .5 },
        { radius: 0.4 });
    const cloudLeft = createShapeInstance(scene, 'sphere', 0xffffff,
        { x: .65, y: 3.2, z: .5 },
        { radius: 0.2 });
    const cloudRight = createShapeInstance(scene, 'sphere', 0xffffff,
        { x: 1.2, y: 2.8, z: .5 },
        { radius: 0.3 });
    // Remove fog and shadow from cloud
    cloudCenter.material.fog = false;
    cloudCenter.castShadow = false;
    cloudCenter.receiveShadow = false;
    cloudLeft.material.fog = false;
    cloudLeft.castShadow = false;
    cloudLeft.receiveShadow = false;
    cloudRight.material.fog = false;
    cloudRight.castShadow = false;
    cloudRight.receiveShadow = false;
       

    // Render Scene Function
    function render(time) {
        time *= 0.001; 
        
        // Sun Animation
        sun.rotation.x += 0.02; 
        sun.rotation.y += 0.02;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    // Call All Functions
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

main();
