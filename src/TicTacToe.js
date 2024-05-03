import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// make an enums for the difficulty
const Mode = {
    NORMAL: 1,
    HARD: 2
}


export default class TicTacToe {
    constructor() {
        this.objLoader = new OBJLoader();
        this.gltfLoader = new GLTFLoader();
        this.mtlLoader = new MTLLoader();

        this.board = new THREE.Group();
        this.boardLines = new THREE.Group();
        this.hiddenTiles = new THREE.Group();
        this.circles = new THREE.Group();
        this.crosses = new THREE.Group();

        this.board.add(this.boardLines);
        this.board.add(this.hiddenTiles);
        this.board.add(this.circles);
        this.board.add(this.crosses);

        this.mode = Mode.NORMAL;
        this.currentPlayer = 'o';
        this.boardCopy = [
            ["-", "-", "-"],
            ["-", "-", "-"],
            ["-", "-", "-"],
        ];
        this.xMoves = [];
        this.oMoves = [];

        const params = {
            color: 0xffffff,
            transmission: 1,
            opacity: 1,
            metalness: 0,
            roughness: 0,
            ior: 3,
            thickness: 0.9,
            specularIntensity: 1,
            specularColor: 0xffffff,
            lightIntensity: 1,
            exposure: 1
        };

        this.material = new THREE.MeshPhysicalMaterial({
            color: params.color,
            metalness: params.metalness,
            roughness: params.roughness,
            ior: params.ior,
            transmission: params.transmission,
            specularIntensity: params.specularIntensity,
            specularColor: params.specularColor,
            opacity: params.opacity,
            side: THREE.DoubleSide,
        });

        this.CreateBoard();
    }

    CreateBoard() {
        //top row
        this.hiddenTiles.add(this.HiddenTile(-40, 40));
        this.hiddenTiles.add(this.HiddenTile(0, 40));
        this.hiddenTiles.add(this.HiddenTile(40, 40));

        //middle row
        this.hiddenTiles.add(this.HiddenTile(-40, 0));
        this.hiddenTiles.add(this.HiddenTile(0, 0));
        this.hiddenTiles.add(this.HiddenTile(40, 0));

        //bottom row
        this.hiddenTiles.add(this.HiddenTile(-40, -40));
        this.hiddenTiles.add(this.HiddenTile(0, -40));
        this.hiddenTiles.add(this.HiddenTile(40, -40));

        this.objLoader.load('/assets/grid.obj', (grid) => {
            grid.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material = this.material;
                    child.geometry = toCreasedNormals(child.geometry, (180 / 180) * Math.PI);

                }
            });

            grid.position.set(0, 0);
            grid.scale.set(0.3, 0.3, 0.3);
            this.boardLines.add(grid);
        });

    }

    HiddenTile(xOffset, yOffset) {
        const hiddenTileGeometry = new THREE.BoxGeometry(22, 22, 1);
        const hiddenTileMaterial = new THREE.MeshNormalMaterial();
        const hiddenTile = new THREE.Mesh(hiddenTileGeometry, hiddenTileMaterial);
        hiddenTile.visible = false;
        hiddenTile.position.set(xOffset, yOffset);
        return hiddenTile;
    }

    UpdateBoard(xOffset, yOffset) {
        let i, j;

        if (xOffset < 0) {
            j = 0;
        } else if (xOffset === 0) {
            j = 1;
        } else {
            j = 2;
        }

        if (yOffset < 0) {
            i = 2;
        } else if (yOffset === 0) {
            i = 1;
        } else {
            i = 0;
        }

        if (this.currentPlayer === "o") {
            this.boardCopy[i][j] = "o";
        } else {
            this.boardCopy[i][j] = "x";
        }

        //console.log(this.boardCopy);
    }

    AddCross(xOffset, yOffset) {
        this.objLoader.load('/assets/x.obj', (cross) => {

            cross.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material = this.material;
                }
            });

            cross.position.set(xOffset, yOffset);
            cross.scale.set(0, 0, 0);
            this.crosses.add(cross);
        });
    }

    AddCircle(xOffset, yOffset) {
        this.objLoader.load('/assets/o.obj', (circle) => {
            circle.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material = this.material;
                }
            });

            circle.position.set(xOffset, yOffset);
            circle.scale.set(0, 0, 0);
            this.circles.add(circle);
        });
    }

    AddCircleOrCross(xOffset, yOffset) {
        if (this.currentPlayer === 'o') {
            this.AddCircle(xOffset, yOffset);
            this.UpdateBoard(xOffset, yOffset);
            this.oMoves.push([xOffset, yOffset]);
            this.currentPlayer = 'x';
        } else {
            this.AddCross(xOffset, yOffset);
            this.UpdateBoard(xOffset, yOffset);
            this.xMoves.push([xOffset, yOffset]);
            this.currentPlayer = 'o';
        }

        this.CheckWin();
    }

    ChangeMode(mode) {
        this.mode = mode;
    }

    DeleteFirstMove(){
        if (this.currentPlayer === 'o'){
            const oldestMove = this.oMoves.popFirst();
            this.boardCopy[oldestMove[0]][oldestMove[1]] = '-';
        }
        else{
            const oldestMove = this.xMoves.popFirst();
            this.boardCopy[oldestMove[0]][oldestMove[1]] = '-';
        }
    }

    CheckWin(){
        if (this.mode == Mode.HARD){
            this.DeleteFirstMove();
        }

        if (this.CheckRows() || this.CheckColumns() || this.CheckDiagonals()){
            console.log('win');
            alert('win');
        }
    }

    CheckRows(){
        for (let i = 0; i < 3; i++){
            if (this.boardCopy[i][0] === this.boardCopy[i][1] && this.boardCopy[i][1] === this.boardCopy[i][2]){
                return true;
            }
        }
        return false;
    }

    CheckColumns(){
        for (let i = 0; i < 3; i++){
            if (this.boardCopy[0][i] === this.boardCopy[1][i] && this.boardCopy[1][i] === this.boardCopy[2][i]){
                return true;
            }
        }
        return false;
    }

    CheckDiagonals(){
        if (this.boardCopy[0][0] === this.boardCopy[1][1] && this.boardCopy[1][1] === this.boardCopy[2][2]){
            return true;
        }
        if (this.boardCopy[0][2] === this.boardCopy[1][1] && this.boardCopy[1][1] === this.boardCopy[2][0]){
            return true;
        }
        return false;
    }

}