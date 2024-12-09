import './style.css'
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//set up scene

const renderer = new THREE.WebGLRenderer({ 
  canvas: document.querySelector('#bg'),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000);
renderer.shadowMap.enabled = true;  // Enable shadow map


const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const scene = new THREE.Scene();

//ground
const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2)
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  side: THREE.DoubleSide,
})
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.receiveShadow = true; 
scene.add(groundMesh);

camera.position.set(1.83, 5.23, -0.78); // Set camera at a visible starting point
// camera.lookAt(0, 0, 0);


//controls
// const controls = new FirstPersonControls(camera, renderer.domElement)
// controls.movementSpeed = 8
// controls.lookSpeed = 0.02

// window.addEventListener('mouseup', (event) => {
//   gsap.to(camera.position, {
//     x: 1.50,
//     y: 5.75,
//     z: -2.93
//   });
// });

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;  
orbit.dampingFactor = 0.05; 
orbit.screenSpacePanning = false;  

//lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xff00ff, 1);
directionalLight.position.set(5, 5, 0);
directionalLight.target.position.set(0, 0, 0);
directionalLight.castShadow = true;  // Enable shadows on the light

scene.add(directionalLight);
scene.add(directionalLight.target)

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
scene.add(hemiLight)

const directLight = new THREE.DirectionalLight(0xff5, 1);
directLight.position.set(-3.4, 6, 1.4); // Set the position of the light in the scene
directLight.target.position.set(0, 0, 0);
directLight.castShadow = true;

scene.add(directLight);
scene.add(directLight.target)

//container for clickable objects
const clickableObjects = []

//raycaster
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

const onMouseClick = (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(clickableObjects);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
    console.log('Clicked on:', clickedObject);

    if (clickedObject.name === 'Object_9') {
      document.getElementById('computer_screen').style.display = 'flex';
    } else if (clickedObject.name === 'Object_36') {
      document.getElementById('folder1').style.display = 'flex';
    } else if (clickedObject.name === 'Object_31') {
      document.getElementById('folder2').style.display = 'flex'
    } else if (clickedObject.name === 'Object_28') {
      document.getElementById('folder3').style.display = 'flex'
    }
    console.log('Clicked on:', clickedObject);

  }
};


// Exit computer screen logic (close button)
document.getElementById('exit-button').addEventListener('click', (event) => {
  event.stopPropagation();
  document.getElementById('computer_screen').style.display = 'none';
});

// Exit folder1 logic (close button)
document.getElementById('exitbtn1').addEventListener('click', (event) => {
  event.stopPropagation();
  document.getElementById('folder1').style.display = 'none';
});
// Exit folder3 logic (close button)
document.getElementById('exitbtn2').addEventListener('click', (event) => {
  event.stopPropagation();
  document.getElementById('folder2').style.display = 'none';
});
// Exit folder1 logic (close button)
document.getElementById('exitbtn3').addEventListener('click', (event) => {
  event.stopPropagation();
  document.getElementById('folder3').style.display = 'none';
});

window.addEventListener('click', onMouseClick);


//responsive window
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//load model
const gltfLoader = new GLTFLoader().setPath('./office_props_pack/');

gltfLoader.load('scene.gltf', (gltf) => {
  const office = gltf.scene;
  scene.add(office);

  office.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      clickableObjects.push(child);
    }
  });
});


// const clock = new THREE.Clock()

function animate() {
  // controls.update(clock.getDelta())
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
