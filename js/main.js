import * as THREE from './three.module.js';
import { FontLoader } from './FontLoader.js';
import { TextGeometry } from './TextGeometry.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// initialize font loader and startTime
let loader = new FontLoader();
let startTime = performance.now();

let stars, starGeo;
let starMaterial;

// text mesh string
let fName = "Guillan";

let elapsedTime = (performance.now() - startTime); // store the start time of the program to "elapsedTime"

lighting();
particles();

function particles() {
  const points = [];

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  let sprite = new THREE.TextureLoader().load("assets/images/star.png");
  starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
  });
  
  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);

}

function animateParticles() {
  // checks if the y position of the "stars" are less than -200 y level.
  // returns to 200 y level if true
    if(stars.position.y < -200)
      stars.position.y = 200
    
    starGeo.verticesNeedUpdate = true;
    stars.position.y -= 0.9;
  }

loader.load( './assets/fonts/gentilis_regular.typeface.json', function ( font ) {

  let textGeometry = new TextGeometry( fName, {
    font: font,
    size: 1,
    height: 0.5,
    curveSegments: 4,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.05,
    bevelSegments: 3
  } );
  let textMaterial = new THREE.MeshNormalMaterial();
  let textMesh = new THREE.Mesh(textGeometry,textMaterial);
  scene.add(textMesh);
  textMesh.position.set(0,.5,0)
  console.log("TEXT LOADED SUCCESS!\n\nText String: " + fName) // used to check if code block is working
} );

function lighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);
}

camera.position.set(2,1,4);
function animate() {
  requestAnimationFrame(animate);

  animateParticles();

  elapsedTime = (performance.now() - startTime) / 1000; // returns milliseconds without dividing it to 1000.
  let elapsedSeconds = parseInt(elapsedTime) // only get the whole number and output as a seconds.

  if ( elapsedSeconds % 3 == 0 && elapsedSeconds != 0){ // compare the remainder of "elapsedSeconds" to 0 if divisible by 3. 3 seconds.
    starMaterial.color.setHex(Math.random() * 0xffffff); // set random hex colors to "starMaterial".
    console.log("\n\n\n COLOR CHANGE!!! \n\n\n")
  }

  console.log("Elapsed time: " + elapsedSeconds + " sec");
  renderer.render(scene, camera);
}

animate();