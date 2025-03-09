import * as THREE from 'three';

export function createLight(scene) {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    // Directional Light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(0, 5, 0); // Above the scene
    directionalLight.target.position.set(0, 0, 0);
    scene.add(directionalLight);
    scene.add(directionalLight.target);
    
    // Directional Light Shadows
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 15;
    
    // Spot Light
    const spotLight = new THREE.SpotLight(0xffffff, 50);
    spotLight.position.set(0, 5, 2);
    spotLight.angle = Math.PI / 16;
    spotLight.penumbra = 0.3;
    spotLight.decay = 2;
    spotLight.distance = 20;
    spotLight.target.position.set(0, 3, 3);
    scene.add(spotLight);
    scene.add(spotLight.target);
    
    // Spot Light Shadows
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.camera.near = 0.5;
    spotLight.shadow.camera.far = 15;

    return { ambientLight, directionalLight, spotLight };
}
