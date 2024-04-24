import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import SceneInit from "./SceneInit";
import TicTacToe from "./TicTacToe";

function App() {
	useEffect(() => {
		const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();

    const game = new TicTacToe();
    test.scene.add(game.board);

    window.addEventListener('mousedown', onMouseDown, false);

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    function onMouseDown(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, test.camera);
      
      const intersects = raycaster.intersectObjects(game.hiddenTiles.children);
      
      if (intersects.length > 0) {
        const xOffset = intersects[0].object.position.x;
        const yOffset = intersects[0].object.position.y;

        game._addCircleOrCross(xOffset, yOffset);

        const index = game.hiddenTiles.children.findIndex((c) => c.uuid === intersects[0].object.uuid);
        game.hiddenTiles.children.splice(index, 1);
      }
    }


    const scaleUp = (obj) => {
      if (obj.scale.x < 1) {
        obj.scale.x += 0.04;
      }
      if (obj.scale.y < 1) {
        obj.scale.y += 0.04;
      }
      if (obj.scale.z < 1) {
        obj.scale.z += 0.04;
      }
    };

    // NOTE: Animate board and player moves.
    const animate = () => {
      game.circles.children.forEach(scaleUp);
      game.crosses.children.forEach(scaleUp);
      // ticTacToe.board.rotation.y += 0.002;
      requestAnimationFrame(animate);
    };
    animate();

	}, []);

	return (
		<div>
			<canvas id="myThreeJsCanvas"></canvas>
		</div>
	);
}

export default App;
