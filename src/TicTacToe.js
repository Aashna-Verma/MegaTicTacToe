import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

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

        this.currentPlayer = 'o';
        this.boardCopy = [
            ["1", "2", "3"],
            ["4", "5", "6"],
            ["7", "8", "9"],
        ];

        const params = {
            color: 0xffffff,
            transmission: 1,
            opacity: 1,
            metalness: 0,
            roughness: 0,
            ior: 1.52,
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

        this._createBoard();


    }

    _createBoard() {

        //top row
        this.hiddenTiles.add(this._hiddenTile(-40, 40));
        this.hiddenTiles.add(this._hiddenTile(0, 40));
        this.hiddenTiles.add(this._hiddenTile(40, 40));

        //middle row
        this.hiddenTiles.add(this._hiddenTile(-40, 0));
        this.hiddenTiles.add(this._hiddenTile(0, 0));
        this.hiddenTiles.add(this._hiddenTile(40, 0));

        //bottom row
        this.hiddenTiles.add(this._hiddenTile(-40, -40));
        this.hiddenTiles.add(this._hiddenTile(0, -40));
        this.hiddenTiles.add(this._hiddenTile(40, -40));        

        this.objLoader.load('/assets/grid.obj', (grid) => {
            grid.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material = this.material
                }
            });

            grid.position.set(0, 0);
            grid.scale.set(0.3, 0.3, 0.3);
            this.boardLines.add(grid);
        });

    }


    _hiddenTile(xOffset, yOffset) {
        const hiddenTileGeometry = new THREE.BoxGeometry(30, 30, 1);
        const hiddenTileMaterial = new THREE.MeshNormalMaterial();
        const hiddenTile = new THREE.Mesh(hiddenTileGeometry, hiddenTileMaterial);
        hiddenTile.visible = false;
        hiddenTile.position.set(xOffset, yOffset);
        return hiddenTile;
    }

    _updateBoard(xOffset, yOffset) {
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

        console.log(this.boardCopy);
    }

    _addCross(xOffset, yOffset) {
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

    _addCircle(xOffset, yOffset) {

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

    _addCircleOrCross(xOffset, yOffset) {
        console.log('here');
        if (this.currentPlayer === 'o') {
            this._addCircle(xOffset, yOffset);
            this._updateBoard(xOffset, yOffset);
            this.currentPlayer = 'x';
        } else {
            this._addCross(xOffset, yOffset);
            this._updateBoard(xOffset, yOffset);
            this.currentPlayer = 'o';
        }
    }
}