/**
 * entry.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */

import {
  WebGLRenderer,
  OrthographicCamera,
  Scene,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Vector3,
} from "three";

function main() {
  const renderer = new WebGLRenderer();
  renderer.autoClearColor = false;

  const camera = new OrthographicCamera(
    -1, // left
    1, // right
    1, // top
    -1, // bottom
    -1, // near,
    1 // far
  );
  const scene = new Scene();
  const plane = new PlaneGeometry(2, 2);

  const fragmentShader = `
    #include <common>

    uniform vec3 iResolution;
    uniform float iTime;

    // By iq: https://www.shadertoy.com/user/iq  
    // license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        // Normalized pixel coordinates (from 0 to 1)
        vec2 uv = fragCoord/iResolution.xy;

        // Time varying pixel color
        vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

        // Output to screen
        fragColor = vec4(col,1.0);
    }

    void main() {
      mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `;
  const uniforms = {
    iTime: { value: 0 },
    iResolution: { value: new Vector3() },
  };
  const material = new ShaderMaterial({
    fragmentShader,
    uniforms,
  });
  scene.add(new Mesh(plane, material));

  // resize
  const windowResizeHanlder = () => { 
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  };
  windowResizeHanlder();
  window.addEventListener('resize', windowResizeHanlder);

  function render(time) {
    time *= 0.001;  // convert to seconds

    windowResizeHanlder();

    const { innerHeight, innerWidth } = window;
    uniforms.iResolution.value.set(innerWidth, innerHeight, 1);
    uniforms.iTime.value = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // dom
  document.body.style.margin = 0;
  document.body.appendChild(renderer.domElement);
}

main();
