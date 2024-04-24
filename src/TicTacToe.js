import * as THREE from 'three';

export default class TicTacToe {
    constructor() {
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

        this._createBoard();
    }

    _createBoard() {
        //top row
        this.hiddenTiles.add(this._hiddenTile(-24, 24));
        this.hiddenTiles.add(this._hiddenTile(0, 24));
        this.hiddenTiles.add(this._hiddenTile(24, 24));

        //middle row
        this.hiddenTiles.add(this._hiddenTile(-24, 0));
        this.hiddenTiles.add(this._hiddenTile(0, 0));
        this.hiddenTiles.add(this._hiddenTile(24, 0));

        //bottom row
        this.hiddenTiles.add(this._hiddenTile(-24, -24));
        this.hiddenTiles.add(this._hiddenTile(0, -24));
        this.hiddenTiles.add(this._hiddenTile(24, -24));


        const left = this._boardLine(4, 64, 4, -12, 0);
        const right = this._boardLine(4, 64, 4, 12, 0);
        const top = this._boardLine(64, 4, 4, 0, 12);
        const bottom = this._boardLine(64, 4, 4, 0, -12);

        this.boardLines.add(left);
        this.boardLines.add(right);
        this.boardLines.add(top);
        this.boardLines.add(bottom);
    }

    _boardLine(x, y, z, xOffset, yOffset) {
        const boardLineGeometry = new THREE.BoxGeometry(x, y, z);
        const boardLineMaterial = new THREE.MeshNormalMaterial();
        const boardLine = new THREE.Mesh(boardLineGeometry, boardLineMaterial);
        boardLine.position.set(xOffset, yOffset);
        //boardLine.scale.set(1, 1, 1);
        return boardLine;
    }

    _hiddenTile(xOffset, yOffset) {
        const hiddenTileGeometry = new THREE.BoxGeometry(12, 12, 1);
        const hiddenTileMaterial = new THREE.MeshNormalMaterial();
        const hiddenTile = new THREE.Mesh(hiddenTileGeometry, hiddenTileMaterial);
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
        const cross = new THREE.Group();
        const crossGeometry = new THREE.BoxGeometry(12, 4, 4);
        const crossMaterial = new THREE.MeshNormalMaterial();
        const cross1 = new THREE.Mesh(crossGeometry, crossMaterial);
        const cross2 = new THREE.Mesh(crossGeometry, crossMaterial);
        cross1.rotation.z = Math.PI / 4;
        cross2.rotation.z = -Math.PI / 4;
        cross.add(cross1, cross2);
        cross.position.x = xOffset;
        cross.position.y = yOffset;
        cross.scale.x = 0;
        cross.scale.y = 0;
        cross.scale.z = 0;
        this.crosses.add(cross);
    }

    _addCircle(xOffset, yOffset) {
        const r = 6;
        const height = 4;
        const cylinderGeometry = new THREE.CylinderGeometry(r, r, height, 100);
        const cylinderMaterial = new THREE.MeshNormalMaterial();
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.position.x = xOffset;
        cylinder.position.y = yOffset;
        cylinder.rotation.x = Math.PI / 2;
        cylinder.scale.x = 0;
        cylinder.scale.y = 0;
        cylinder.scale.z = 0;
        this.circles.add(cylinder);
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