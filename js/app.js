window.onload = () => {
    init();
};

let canvas, renderer, scene, camera, light;
let angle = 0.02;
let cameraPositionZ = 4;
let mouseX, mouseY;
let currentScale = 1;
let scaleFactor = 0.1;
let rotationValues = [];
const form = document.querySelector('form');
let initialLightcolor = 0xffffff;


let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;
const mouseSensitivity = 0.005;


/**
 * 
 * @param {
 * 
 * } e 
 */


document.onkeydown = function (e) {
    switch (e.key) {
        case "w":
            camera.position.z -= 0.1;
            break;
        case "a":
            camera.position.x -= 0.1;
            break;
        case "s":
            camera.position.z += 0.1;
            break;
        case "d":
            camera.position.x += 0.1;
            break;
    }
};


/**
 * Initializes the scene and configures objects, camera and mouse events.
 * 
 */

function init() {
    canvas = document.getElementById("gl-canvas");
    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setClearColor(0xffffff);
    renderer.setSize(canvas.width, canvas.height, false);
    scene = new THREE.Scene();

    const minObjects = 5;
    const maxObjects = 30;
    const objectProbability = Math.floor(Math.random() * (maxObjects - minObjects + 1)) + minObjects;

    for (let i = 0; i < objectProbability; i++) {
        const objectTypeProbability = Math.random() * 100;

        if (objectTypeProbability < 50) {
            makeCube();
        } else {
            makePyramid();
        }
    }

    const fov = 75;
    const near = 0.1;
    const far = 5;
    const aspect = canvas.width / canvas.height;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = cameraPositionZ;
    
    canvas.addEventListener("mousedown", function (e) {
        isDragging = true;
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
    });
    
    canvas.addEventListener("mouseup", function () {
        isDragging = false;
    });
    
    canvas.addEventListener("mousemove", function (e) {
        if (isDragging) {
            const deltaX = e.clientX - previousMouseX;
            const deltaY = e.clientY - previousMouseY;
    
            camera.rotation.y -= deltaX * mouseSensitivity;
            camera.rotation.x -= deltaY * mouseSensitivity;
    
            previousMouseX = e.clientX;
            previousMouseY = e.clientY;
        }
    });
    light = new THREE.AmbientLight(initialLightcolor, 1);
    scene.add(light);
    render();
}

/**
 * Creates a cube with random dimensions and adds it to the scene
 * 
 */

function makeCube() {
    const minEdgeLength = 0.1;
    const maxEdgeLength = 0.5;
    const edgeLength = Math.random() * (maxEdgeLength - minEdgeLength) + minEdgeLength;
    const geometry = new THREE.BoxGeometry(edgeLength, edgeLength, edgeLength);
    const cube = new THREE.Mesh(geometry, texture(6));
    const minX = -10;
    const maxX = 10;
    const posY = Math.floor(Math.random() * 2 - 1);
    const minZ = -10;
    const maxZ = 10;
    const posX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const posZ = Math.floor(Math.random() * (maxZ - minZ + 1)) + minZ;
    cube.position.set(posX, posY, posZ);
    rotationValues.push({ x: Math.random() * 0.1, y: Math.random() * 0.1, z: Math.random() * 0.1 });
    scene.add(cube);
}

/**
 * Creates a pyramid with random dimensions and adds it to the scene
 * 
 */

function makePyramid() {
    const minEdgeLength = 0.1;
    const maxEdgeLength = 0.5;
    const edgeLength = Math.random() * (maxEdgeLength - minEdgeLength) + minEdgeLength;
    const geometry = new THREE.CylinderGeometry(0, edgeLength * 0.5, edgeLength, 4, 1);
    const pyramid = new THREE.Mesh(geometry, texture(5));
    const minX = -10;
    const maxX = 10;
    const posY = Math.floor(Math.random() * 2 - 1);
    const minZ = -10;
    const maxZ = 10;
    const posX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const posZ = Math.floor(Math.random() * (maxZ - minZ + 1)) + minZ;
    pyramid.position.set(posX, posY, posZ);
    rotationValues.push({ x: Math.random() * 0.1, y: Math.random() * 0.1, z: Math.random() * 0.1 });
    scene.add(pyramid);
}

/**
 * 
 * Returns a texture or an array of materials with random colors depending on probability.
 * 
 * @param {*} numColors 
 * @returns 
 */

function texture(numColors) {
    const loader = new THREE.TextureLoader();
    const probability = Math.random(); //Gera um número aleatório entre 0 e 1
    if (probability < 0.5) {
        //Retorna uma textura aplicada ao material
        return new THREE.MeshLambertMaterial({ map: loader.load('/textures/texture.png') });
    } else {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
          const color = new THREE.Color(Math.random(), Math.random(), Math.random());
          colors.push(color);
        }
        const materials = colors.map((color) => new THREE.MeshLambertMaterial({ color: color }));
        return materials;
    }
}

/**
 * 
 * Renders the scene, updating object rotations and rendering with the renderer.
 */
function render() {
    for (let i = 0; i < scene.children.length; i++) {
      const object = scene.children[i];
      if (object instanceof THREE.Mesh) {
        const { x, y, z } = rotationValues[i];
        object.rotation.x += x;
        object.rotation.y += y;
        object.rotation.z += z;
      }
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}


/**
 * Handles the form submission event.
 * Removes the existing light from the scene, creates a new light based on the form values, and resets the form.
 * 
 * 
 * @param {Event} event
 * 
 */
form.addEventListener('submit', function(event) {
    scene.remove(light);
    scene.remove(light.target);
    event.preventDefault();
    const lightType = document.getElementById('lightType').value;
    const directionX = document.getElementById('directionX').value;
    const directionY = document.getElementById('directionY').value;
    const directionZ = document.getElementById('directionZ').value;
    const intensityR = document.getElementById('intensityR').value;
    const intensityG = document.getElementById('intensityG').value;
    const intensityB = document.getElementById('intensityB').value;

    const lightInfo = {
        type: lightType,
        direction: { x: directionX, y: directionY, z: directionZ },
        intensity: `#${toHex(intensityR)}${toHex(intensityG)}${toHex(intensityB)}`
    };

    makeLight(lightInfo);

    form.reset();
});

/**
 * 
 * Creates a new light based on the given information and adds it to the scene.
 * @param {*} lightInfo 
 * @returns 
 */
function makeLight(lightInfo) {
    switch (lightInfo.type) {
        case "ambient": // light that shoots light in all directions
            light = new THREE.AmbientLight(lightInfo.intensity, 2);
            break;
        case "sun": // often used to represent the sun, and will shine in the direction of its target
            light = new THREE.DirectionalLight(lightInfo.intensity, 2);
            light.position.set(5, 5, 5);
            light.target.position.set(lightInfo.x, lightInfo.y, lightInfo.z);
            scene.add(light);
            break;
        default:
            return -1;
    }
    scene.add(light);
}
/**
 * 
 * Converts a numeric value to a hexadecimal representation.
 * @param {*} value 
 * @returns 
 */
function toHex(value) {
    const hex = parseInt(value).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}