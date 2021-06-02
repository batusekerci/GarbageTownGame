"use strict";

import {GLTFLoader} from "../examples/jsm/loaders/GLTFLoader.js";
import {scene} from "./main.js";
import * as THREE from "../build/three.module.js";

export function setupGrid(grid) {
	addToGrid(grid, 4, 7, "./resources/models/asia_building.gltf");
	addToGrid(grid, 1, 0, "./resources/models/ramen_rest.gltf");
	addToScene(0,0,0, "./resources/models/modifiedCity.gltf");
	addToGrid(grid, 4,3, "./resources/models/building1.gltf");
	addToGrid(grid, 4,4, "./resources/models/school.gltf");
	addToGrid(grid, 0,7, "./resources/models/warehouse1.gltf");
	addToGrid(grid, 6, 4, "./resources/models/solarPanel.gltf");
	addToGrid( grid, 4, 0, './resources/models/b1.gltf' );
	addToGrid( grid, 5, 2, './resources/models/b4.gltf' );
	addToGrid( grid, 5, 3, './resources/models/b5.gltf' );
	addToGrid( grid, 5, 6, './resources/models/b6.gltf' );
	addToGrid( grid, 0, 1, './resources/models/b7.gltf' );
	addToGrid( grid, 0, 3, './resources/models/gok.gltf' );
	addToGrid( grid, 5, 7, './resources/models/b10.gltf' );
	addToGrid( grid, 2, 0, './resources/models/b11.gltf' );
	addToGrid( grid, 1, 1, './resources/models/b12.gltf' );
}

export function setupSelectables(grid, selectables) {
	selectables.push(grid[0][0]);
	selectables.push(grid[2][1]);
	selectables.push(grid[5][1]);
	selectables.push(grid[1][3]);
	selectables.push(grid[2][6]);
	selectables.push(grid[4][6]);

	addToGrid( grid, 0, 0, './resources/models/hammerwre.gltf' );
	addToGrid( grid, 2, 1, './resources/models/hammerwre.gltf' );
	addToGrid( grid, 5, 1, './resources/models/hammerwre.gltf' );
	addToGrid( grid, 1, 3, './resources/models/hammerwre.gltf' );
	addToGrid( grid, 2, 6, './resources/models/hammerwre.gltf' );
	addToGrid( grid, 4, 6, './resources/models/hammerwre.gltf' );

	for (let i = 0; i < 5; ++i) {
		let gridObj = new THREE.Group();
		grid[6][i] = gridObj;
		gridObj.name = "grid-" + 6 + "-" + i;
		scene.add(gridObj);
	}
	grid[6][0].position.set(-405, 0, 202.5);
	grid[6][1].position.set(-486, 0, 202.5);
	grid[6][2].position.set(486, 0, -40.5);
	grid[6][3].position.set(486, 0, 121.5);
	grid[6][4].position.set(-364.5, 0, -243);

	selectables.push(grid[6][0]);
	selectables.push(grid[6][1]);
	selectables.push(grid[6][2]);
	selectables.push(grid[6][3]);
	selectables.push(grid[6][4]);

	addToGrid( grid, 6, 0, './resources/models/hammerwre.gltf' );
	addToGrid( grid, 6, 1, './resources/models/hammerwre.gltf' );
	addToGrid( grid, 6, 2, './resources/models/hammerwre.gltf' );
	addToGrid( grid, 6, 3, './resources/models/hammerwre.gltf' );
}

function addToGrid(grid, i, j, path) {
	let gridGroup = grid[i][j];
	gridGroup.remove(...gridGroup.children);

	const loader = new GLTFLoader();
	loader.load(path, function ( gltf ) {
			gltf.scene.traverse(function (node) {
				if (node.isMesh) {
					node.castShadow = true;
					node.receiveShadow = true;
					node.material.side = THREE.FrontSide;
				}
			});
			gridGroup.add( gltf.scene );
		}, undefined,
		function (er){
			console.log("Error loading model:", path);
		});
}

function addToScene(x, y, z, path) {	// translate not added yet !!
	const loader = new GLTFLoader();
	loader.load( path,function (gltf){
		gltf.scene.traverse(function (node) {
			if (node.isMesh) {
				node.castShadow = true;
				node.receiveShadow = true;
				node.material.side = THREE.FrontSide;
			}
		});
		scene.add( gltf.scene );
	});
}

class Logger{
	constructor(log_id) {
		if(log_id===1){
			this.divElement = document.getElementById("log");
			this.lastAddedTexts = [];
			this.lastAddedTexts.push("Welcome to Garbage Town!");
			this.add("Loading Assets, please click for sounds...");
		}
		else if(log_id===2){
			this.divElement2 = document.getElementById("tips_log");
			this.lastAddedTexts2 = [];
		}
	}

	add(string) {
		this.lastAddedTexts.push(string);
		if (this.lastAddedTexts.length > 8) {
			this.lastAddedTexts.shift();
		}
		this.divElement.textContent = "-" + this.lastAddedTexts.join("\n-");
	}
	plus(string){
		this.lastAddedTexts2.push(string);
		if (this.lastAddedTexts2.length > 1) {
			this.lastAddedTexts2.shift();
		}
		this.divElement2.textContent = this.lastAddedTexts2[0];
	}
}

let truck = null;
let trash = null;
function getTruckMesh() {
	const loader = new GLTFLoader();
	loader.load( "./resources/models/trash_truck.gltf",function (gltf){
		gltf.scene.traverse(function (node) {
			if (node.isMesh) {
				node.castShadow = true;
				node.receiveShadow = true;
				node.material.side = THREE.FrontSide;
			}
		});
		scene.add( gltf.scene );
		truck = gltf.scene;
	});
}

function getTrashMesh() {
	const loader = new GLTFLoader();
	loader.load( "./resources/models/trash.gltf",function (gltf){
		gltf.scene.traverse(function (node) {
			if (node.isMesh) {
				node.castShadow = true;
				node.receiveShadow = true;
				node.material.side = THREE.FrontSide;
			}
		});
		scene.add( gltf.scene );
		trash = gltf.scene;
		trash.scale.set(10,10,10);
	});
}

const facilityPaths = [
	'./resources/models/geonew.gltf',
	'./resources/models/solarNew.gltf',
	'./resources/models/windTurbines.gltf',
	'./resources/models/biomass.gltf',
	'./resources/models/park2.gltf'
];
let facilityMeshes = [];
for (let i = 0; i<5;i++) {
	const loader = new GLTFLoader();
	loader.load( facilityPaths[i],function (gltf){
		gltf.scene.traverse(function (node) {
			if (node.isMesh) {
				node.castShadow = true;
				node.receiveShadow = true;
				node.material.side = THREE.FrontSide;
			}
		});
		facilityMeshes[i] = gltf.scene;
	});
}

const transformablePaths = [
	'./resources/models/basketball.gltf',
	'./resources/models/trash2.gltf',
	'./resources/models/heli.gltf'
];
let transformableMeshes = [];
for (let i = 0; i<3;i++) {
	const loader = new GLTFLoader();
	loader.load( transformablePaths[i],function (gltf){
		gltf.scene.traverse(function (node) {
			if (node.isMesh) {
				node.castShadow = true;
				node.receiveShadow = true;
				node.material.side = THREE.FrontSide;
			}
		});
		transformableMeshes[i] = gltf.scene;
		scene.add(gltf.scene);
	});
}

getTruckMesh();
getTrashMesh();
let logger = new Logger(1);
let tips_logger = new Logger(2);
export {truck, trash, logger, tips_logger, facilityMeshes, transformableMeshes};
