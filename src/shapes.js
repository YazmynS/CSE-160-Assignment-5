import * as THREE from 'three';

export function createShapeInstance(scene, shapeType, color, position, size, texture = null) {
    let geometry;
    
    // Define shape geometries based on the type
    switch (shapeType) {
        case 'cube':
            geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
            break;
        case 'sphere':
            geometry = new THREE.SphereGeometry(size.radius, 32, 32);
            break;
        case 'cylinder':
            geometry = new THREE.CylinderGeometry(size.radiusTop, size.radiusBottom, size.height, 32);
            break;
        case 'pyramid':
            geometry = new THREE.CylinderGeometry(size.radiusTop, size.radiusBottom, size.height, size.radialSegments);
            break;
        case 'prism':
            geometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
            break;

    }

    // Define material
    let material;
    if (texture) {
        material = new THREE.MeshPhongMaterial({ map: texture });
    } else {
        material = new THREE.MeshPhongMaterial({ color });
    }

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Add to scene
    scene.add(mesh);
    return mesh;
}
