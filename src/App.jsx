import { useEffect } from "react";
import * as THREE from "three";
import SceneInit from "./SceneInit";
import TicTacToe from "./TicTacToe";
import { Mode } from "./TicTacToe";

function App() {
  
  const test = new SceneInit("myThreeJsCanvas");
  const game = new TicTacToe();
  const mouse = new THREE.Vector2();
	const raycaster = new THREE.Raycaster();
	
  useEffect(() => {
		
		test.initialize();
		test.animate();
		test.scene.add(game.board);

		window.addEventListener("mouseup", onMouseUp, false);
		
		animate();
	}, []);

  const onMouseUp = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, test.camera);

    const intersects = raycaster.intersectObjects(game.hiddenTiles.children);

    if (intersects.length > 0) {
      const xOffset = intersects[0].object.position.x;
      const yOffset = intersects[0].object.position.y;

      game.AddCircleOrCross(xOffset, yOffset);

      const index = game.hiddenTiles.children.findIndex(
        (c) => c.uuid === intersects[0].object.uuid
      );
      game.hiddenTiles.children.splice(index, 1);
    }
  }

  const scaleUp = (obj) => {
    if (obj.scale.x < 0.3) {
      obj.scale.x += 0.1;
    }
    if (obj.scale.y < 0.3) {
      obj.scale.y += 0.1;
    }
    if (obj.scale.z < 0.3) {
      obj.scale.z += 0.1;
    }
  };
  
  const animate = () => {
			game.circles.children.forEach(scaleUp);
			game.crosses.children.forEach(scaleUp);
			// ticTacToe.board.rotation.y += 0.002;
			requestAnimationFrame(animate);
		};

	return (
		<>
			<div id="background"></div>
			<div id="user-interface" className="grid gap-4">
				<button onClick={() => game.ChangeMode(Mode.NORMAL)}>Normal</button>
				<button onClick={() => game.ChangeMode(Mode.HARD)}>Hard</button>
        <button onClick={() => game.ClearBoard()}>Restart</button>
			</div>
			<div>
				<canvas id="myThreeJsCanvas"></canvas>
			</div>
		</>
	);
}

export default App;
