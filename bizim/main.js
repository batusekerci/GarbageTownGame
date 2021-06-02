'use strict';
import { setupGrid, setupSelectables, logger, truck,
	trash, facilityMeshes, transformableMeshes, tips_logger } from './init.js';
import * as THREE from '../build/three.module.js';
import { bfs, randGrid } from './bfs.js';
import { remainingTime, showUnbuiltInfo, getDetailedFacilityInfo, facilityDB } from './logic.js';
import { TransformControls } from '../examples/jsm/controls/TransformControls.js';
// initializing --------------------------------------------------------------
const scene = new THREE.Scene();
scene.fog = new THREE.Fog( 0x636363, 300, 700 );
const camera = new THREE.PerspectiveCamera( 30, window.innerWidth /
	window.innerHeight, 5, 7000 );
camera.position.z = 20;
camera.position.y = 350;
scene.add( camera );
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );
renderer.setClearColor( 0x777777 );
//-----------------------------------------------------------------------------
// lights ----------------------------------------------------------------
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 50;
directionalLight.shadow.camera.far = 1050;
directionalLight.shadow.camera.left = - 250;
directionalLight.shadow.camera.right = 250;
directionalLight.shadow.camera.bottom = - 250;
directionalLight.shadow.camera.top = 250;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.bias = - 0.0001;
scene.add( directionalLight );
const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
scene.add( ambientLight );
let spotlightON = false;
let spotLIntensity = 2;
const spotlight = new THREE.SpotLight( 0xffffff, 0, 0,
	0.3, 0.1 );
camera.add( spotlight );
camera.add( spotlight.target );
spotlight.position.set( 0, 0, - 1 );
spotlight.target.position.set( 0, 0, - 2 );
// ---------------------------------------------------------------------------------
// Transform controls --------------------------------------------------------------
const tControls = new TransformControls( camera, renderer.domElement );
scene.add( tControls );
// ----------------------------------------------------------------------------
// Grid setup/Mouse Events -------------------------------------------------
const grid = [];
const selectables = [];
const selectableFacilities = [];
for ( let i = 0; i < 8; i ++ ) {

	grid[ i ] = [];

}

for ( let i = 0; i < 6; ++ i ) {

	for ( let j = 0; j < 8; ++ j ) {

		const gridObj = new THREE.Group();
		gridObj.position.set( - 280 + 80 * j, 0, - 200 + 80 * i );
		grid[ i ][ j ] = gridObj;
		gridObj.name = 'grid-' + i + '-' + j;
		scene.add( gridObj );

	}

}

setupSelectables( grid, selectables );
setupGrid( grid );
selectableFacilities.push( grid[ 6 ][ 4 ] );
// --------------------------------------------------------------------------
// Spline Curve ----------------------------------------------------------
let trashPos = randGrid( 0, 0 );
let splineCurve = new THREE.SplineCurve( bfs( 0, 0, trashPos[ 0 ], trashPos[ 1 ] ) );
//------------------------------------------------------------------------
let truckSpeed = 1.0;
let speedFactor = truckSpeed * 20 / splineCurve.getLength();
let splineLength = splineCurve.getLength();
let prevTrashPos = trashPos;
const truckPosition = new THREE.Vector2();
const truckTarget = new THREE.Vector2();
const trashPosition = new THREE.Vector2();
let truckTime = 0;
let secAccum = 0;
let minAccum = 0;
let minutesPassed = 0;
let prevTime_s = 0;
let time_s;
let timePassed_s;
let pollution = 1000;
let money = 5000;
let pollution_rate = 12;
let money_rate = 10000 / 60;
let pollConst = 0;
let monConst = 0;
let firstTime = true;
let clickedTrash = false;
const gameLoop = function ( time_ms ) {

	time_s = time_ms * 0.001;
	if ( firstTime ) {

		prevTime_s = time_s;
		firstTime = false;

	}

	timePassed_s = time_s - prevTime_s;
	prevTime_s = time_s;
	// Testing selection ----------------------------------------------
	if ( selectedObject ) {

		selectedObject.rotation.y += 2 * timePassed_s;

	}

	if ( minutesPassed >= 5 ) {

		logger.add( 'Game Over!!' );
		logger.add( 'Pollution: ' + pollution.change.toFixed( 0 ) );
		document.removeEventListener( 'keydown', keyDownFunc );
		document.removeEventListener( 'keyup', keyUpFunc );
		document.removeEventListener( 'mousedown', mouseDownFunc, false );
		return;

	}

	// -----------------------------------------------------------
	// Truck move------------------------------------------------
	speedFactor = truckSpeed * 20 / splineLength;
	truckTime += timePassed_s * speedFactor;
	if ( ! clickedTrash ) {

		truckTime = 0;

	}

	if ( truckTime < 1 ) {

		splineCurve.getPointAt( truckTime % 1, truckPosition );
		splineCurve.getPointAt( 1, trashPosition );
		if ( truckTime < 0.985 ) {

			splineCurve.getPointAt( truckTime + 0.01, truckTarget );
			truck.lookAt( truckTarget.x, 0, truckTarget.y );

		}

		truck.position.set( truckPosition.x, 0, truckPosition.y );
		trash.position.set( trashPosition.x, 3, trashPosition.y );
		trash.rotation.y += 3 * timePassed_s;

	} else {

		truckTime = 0;
		trashPos = randGrid( prevTrashPos[ 0 ], prevTrashPos[ 1 ] );
		splineCurve = new THREE.SplineCurve( bfs( prevTrashPos[ 0 ], prevTrashPos[ 1 ],
			trashPos[ 0 ], trashPos[ 1 ] ) );
		prevTrashPos = trashPos;
		splineLength = splineCurve.getLength();
		logger.add( 'Trash Collected... pollution -50, money +250' );
		pollution.change -= 50;
		money.change += 250;
		clickedTrash = false;

	}

	//-----------------------------------------------------------
	// Camera movements ------------------------------------------------------
	camZrotation += timePassed_s * 2 * ( camZrotCC - camZrotC );
	camera.setRotationFromEuler( new THREE.Euler( camXrotation,
		camYrotation, camZrotation, 'YXZ' ) );
	camera.getWorldDirection( camDirection );
	camDirection.y = 0;
	camDirection.normalize();
	camDirection.multiplyScalar(
		timePassed_s * 100 * ( camMoveForward - camMoveBackward ) );
	camera.position.add( camDirection );
	camera.getWorldDirection( camDirection );
	camDirection.cross( upVector );
	camDirection.normalize();
	camDirection.multiplyScalar( timePassed_s * 100 * ( camMoveRight - camMoveLeft ) );
	camera.position.add( camDirection );
	camera.position.y += timePassed_s * 100 * ( camMoveUp - camMoveDown );
	// -----------------------------------------------------------------------
	// Setting Shadow range --------------------------------------------------
	directionalLight.target.position.set( camera.position.x,
		0, camera.position.z );
	dLightVector = directionalLight.target.position.clone();
	dLightVector.add( targetVector );
	directionalLight.position.set( dLightVector.x, dLightVector.y, dLightVector.z );
	directionalLight.target.updateMatrixWorld();
	// -----------------------------------------------------------------------
	secAccum += timePassed_s;
	if ( secAccum > 1 ) {

		secAccum --;
		pollution.change += pollution_rate;
		money.change += money_rate;

	}

	minAccum += timePassed_s;
	if ( minAccum > 60 ) {

		minutesPassed ++;
		minAccum -= 60;
		pollution_rate += 3.25 + pollConst;
		money_rate += ( 2000 + monConst ) / 60;
		pollConst ++;
		monConst += 1000;

	}

	scene.fog.far = 1000 * 1500 * 1500 / ( pollution.change * pollution.change );
	scene.fog.near = 500 * 1500 * 1500 / ( pollution.change * pollution.change );
	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.render( scene, camera );
	requestAnimationFrame( gameLoop );

};

document.addEventListener( 'keydown', keyDownFunc );
document.addEventListener( 'keyup', keyUpFunc );
document.addEventListener( 'mousedown', mouseDownFunc, false );
let camMoveForward = 0;
let camMoveBackward = 0;
let camMoveRight = 0;
let camMoveLeft = 0;
let camMoveUp = 0;
let camMoveDown = 0;
let camZrotCC = 0;
let camZrotC = 0;
function keyDownFunc( e ) {

	if ( e.key === 'w' || e.key === 'W' ) {

		camMoveForward = 1;

	}

	if ( e.key === 's' || e.key === 'S' ) {

		camMoveBackward = 1;

	}

	if ( e.key === 'd' || e.key === 'D' ) {

		camMoveRight = 1;

	}

	if ( e.key === 'a' || e.key === 'A' ) {

		camMoveLeft = 1;

	}

	if ( e.key === 'k' || e.key === 'K' ) {

		camZrotCC = 1;

	}

	if ( e.key === 'l' || e.key === 'L' ) {

		camZrotC = 1;

	}

	if ( e.key === ' ' ) {

		camMoveUp = 1;

	}

	if ( e.key === 'Shift' ) {

		camMoveDown = 1;

	}

	if ( e.key === 'e' || e.key === 'E' ) {

		togglePointerLock();

	}

}

function keyUpFunc( e ) {

	if ( e.key === 'w' || e.key === 'W' ) {

		camMoveForward = 0;

	}

	if ( e.key === 's' || e.key === 'S' ) {

		camMoveBackward = 0;

	}

	if ( e.key === 'd' || e.key === 'D' ) {

		camMoveRight = 0;

	}

	if ( e.key === 'a' || e.key === 'A' ) {

		camMoveLeft = 0;

	}

	if ( e.key === 'k' || e.key === 'K' ) {

		camZrotCC = 0;

	}

	if ( e.key === 'l' || e.key === 'L' ) {

		camZrotC = 0;

	}

	if ( e.key === ' ' ) {

		camMoveUp = 0;

	}

	if ( e.key === 'Shift' ) {

		camMoveDown = 0;

	}

	if ( e.key === 'f' || e.key === 'F' ) {

		spotlightON = ! spotlightON;
		spotlight.intensity = spotLIntensity * spotlightON;

	}

	if ( e.key === 't' || e.key === 'T' ) {

		spotLIntensity ++;
		spotlight.intensity = spotLIntensity * spotlightON;

	}

	if ( e.key === 'g' || e.key === 'G' ) {

		if ( spotLIntensity > 0 ) {

			spotLIntensity --;

		}

		spotlight.intensity = spotLIntensity * spotlightON;

	}

	if ( e.key === 'r' || e.key === 'R' ) {	// reset camera

		camXrotation = - 1;
		camYrotation = 0.7;
		camZrotation = 0;
		camera.position.y = 350;

	}

	if ( e.key === 'b' || e.key === 'B' ) {

		tControls.setMode( 'translate' );

	}

	if ( e.key === 'n' || e.key === 'N' ) {

		tControls.setMode( 'rotate' );

	}

	if ( e.key === 'm' || e.key === 'M' ) {

		tControls.setMode( 'scale' );

	}

	if ( e.key === 'x' || e.key === 'X' ) {

		if ( tControls.object === transformableMeshes[ 0 ] ) {

			tControls.detach();

		} else {

			tControls.attach( transformableMeshes[ 0 ] );

		}

	}

	if ( e.key === 'c' || e.key === 'C' ) {

		if ( tControls.object === transformableMeshes[ 1 ] ) {

			tControls.detach();

		} else {

			tControls.attach( transformableMeshes[ 1 ] );

		}

	}

	if ( e.key === 'v' || e.key === 'V' ) {

		if ( tControls.object === transformableMeshes[ 2 ] ) {

			tControls.detach();

		} else {

			tControls.attach( transformableMeshes[ 2 ] );

		}

	}

	if ( e.key === 'q' || e.key === 'Q' ) {

		let tempMat;
		scene.traverse( function ( node ) {

			if ( node.isMesh ) {

				tempMat = node.material;
				node.material = node[ 'prevMaterial' ];
				node[ 'prevMaterial' ] = tempMat;
				node.material.needsUpdate = true;

			}

		} );

	}

	if ( e.key === '1' ) {

		buildFacility( 1 );

	}

	if ( e.key === '2' ) {

		buildFacility( 2 );

	}

	if ( e.key === '3' ) {

		buildFacility( 3 );

	}

	if ( e.key === '4' ) {

		buildFacility( 4 );

	}

	if ( e.key === '5' ) {

		buildFacility( 5 );

	}

	if ( e.key === 'u' || e.key === 'U' ) {

		upgradeFacility();

	}

}

let selectedObject = null;
let selectedFacility = null;
const builtFacilities = { 'grid-6-4': { facilityType: 'Recycling Facility',
	upgradeLevel: 1, IPR: 0, PRS: 0 } };
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
function mouseDownFunc( event ) {

	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	const buildableIntersects = raycaster.intersectObjects( selectables, true );
	const facilityIntersects = raycaster.intersectObjects( selectableFacilities,
		true );
	const trashIntersects = raycaster.intersectObject( trash, true );
	if ( trashIntersects.length > 0 ) {

		clickedTrash = true;
		// çöpe tıklandı

	}

	if ( facilityIntersects.length > 0 ) {

		let currentObj = facilityIntersects[ 0 ].object;
		while ( currentObj.parent.type !== 'Scene' ) {

			currentObj = currentObj.parent;

		}

		selectedFacility = currentObj;
		showFacilityInfo( selectedFacility );
		if ( selectedObject ) {

			selectedObject.rotation.y = 0;

		}

		selectedObject = null;
		// facility tıklandı

	} else {

		selectedFacility = null;
		if ( buildableIntersects.length > 0 ) {

			if ( selectedObject ) {

				selectedObject.rotation.y = 0;

			}

			let currentObj = buildableIntersects[ 0 ].object;
			while ( currentObj.parent.type !== 'Scene' ) {

				currentObj = currentObj.parent;

			}

			selectedObject = currentObj;
			block3.textContent = showUnbuiltInfo();
			// çekiçe tıklandı

		} else {

			if ( selectedObject ) {

				selectedObject.rotation.y = 0;

			}

			selectedObject = null;
			block3.textContent = 'Nothing Selected';

		}

	}

}

let pointerLocked = false;
function togglePointerLock() {

	if ( pointerLocked ) {

		document.exitPointerLock();
		document.removeEventListener( 'mousemove', mouseTrack );
		pointerLocked = false;

	} else {

		renderer.domElement.requestPointerLock();
		document.addEventListener( 'mousemove', mouseTrack );
		pointerLocked = true;

	}

}

let camXrotation = - 1.1;
let camYrotation = 0.7;
let camZrotation = 0;
function mouseTrack( mouse ) {

	camXrotation -= mouse.movementY * 0.003;
	camYrotation -= mouse.movementX * 0.003;
	if ( camXrotation > Math.PI * 0.49 ) {

		camXrotation = Math.PI * 0.49;

	} else if ( camXrotation < - Math.PI * 0.49 ) {

		camXrotation = - Math.PI * 0.49;

	}

}

function buildFacility( fNo ) {

	if ( selectedObject ) {

		const nameOfGrid = selectedObject.name;
		builtFacilities[ nameOfGrid ] = {};
		builtFacilities[ nameOfGrid ].upgradeLevel = 1;
		const someMesh = facilityMeshes[ fNo - 1 ].clone();
		someMesh.traverse( function ( node ) {

			if ( node.isMesh ) {

				node[ 'prevMaterial' ] = new THREE.MeshToonMaterial( { map: node.material.map,
					color: 0xaaf4f4, side: THREE.FrontSide } );

			}

		} );
		switch ( fNo ) {

			case 1:
				if ( money.change < 5000 ) {

					logger.add( 'Not Enough Money' );
					return;

				} else {

					money.change -= 5000;
					pollution.change -= 175;
					pollution_rate -= 2;
					builtFacilities[ nameOfGrid ].facilityType = 'Geothermal';
					builtFacilities[ nameOfGrid ].IPR = 175;
					builtFacilities[ nameOfGrid ].PRS = 2;
					logger.add( 'Geothermal was built' );
					tips_logger.plus( facilityDB.geothermal[ '1' ].tips );
					break;

				}

			case 2:
				if ( money.change < 4000 ) {

					logger.add( 'Not Enough Money' );
					return;

				} else {

					money.change -= 4000;
					pollution.change -= 150;
					pollution_rate -= 1;
					builtFacilities[ nameOfGrid ].facilityType = 'Solar Panel';
					builtFacilities[ nameOfGrid ].IPR = 150;
					builtFacilities[ nameOfGrid ].PRS = 1;
					logger.add( 'Solar Panel was built' );
					tips_logger.plus( facilityDB.solar_panel[ '1' ].tips );
					break;

				}

			case 3:
				if ( money.change < 4000 ) {

					logger.add( 'Not Enough Money' );
					return;

				} else {

					money.change -= 4000;
					pollution.change -= 150;
					pollution_rate -= 1;
					builtFacilities[ nameOfGrid ].facilityType = 'Wind Turbine';
					builtFacilities[ nameOfGrid ].IPR = 150;
					builtFacilities[ nameOfGrid ].PRS = 1;
					logger.add( 'Wind Turbine was built' );
					tips_logger.plus( facilityDB.wind_turbine[ '1' ].tips );
					break;

				}

			case 4:

				if ( money.change < 7500 ) {

					logger.add( 'Not Enough Money' );
					return;

				} else {

					money.change -= 7500;
					pollution.change -= 250;
					pollution_rate -= 3;
					builtFacilities[ nameOfGrid ].facilityType = 'Biomass Factory';
					builtFacilities[ nameOfGrid ].IPR = 250;
					builtFacilities[ nameOfGrid ].PRS = 3;
					logger.add( 'Biomass Factory was built' );
					tips_logger.plus( facilityDB.biomass[ '1' ].tips );
					break;

				}

			case 5:
				if ( money.change < 1500 ) {

					logger.add( 'Not Enough Money' );
					return;

				} else {

					money.change -= 1500;
					pollution.change -= 100;
					pollution_rate -= 1;
					builtFacilities[ nameOfGrid ].facilityType = 'Park';
					builtFacilities[ nameOfGrid ].IPR = 100;
					builtFacilities[ nameOfGrid ].PRS = 1;
					logger.add( 'Park was built' );
					tips_logger.plus( facilityDB.park[ '1' ].tips );
					break;

				}

		}

		selectedObject.remove( ...selectedObject.children );
		selectedObject.add( someMesh );
		selectedObject.rotation.y = 0;
		selectableFacilities.push( selectedObject );
		selectedObject = null;
		// facility kuruldu
		block3.textContent = 'Nothing selected';

	}

}

function showFacilityInfo( groupObj ) {

	const facility = builtFacilities[ groupObj.name ];
	const info = getDetailedFacilityInfo( facility.facilityType, facility.upgradeLevel, facility.IPR, facility.PRS );
	block3.textContent = '\n' + info;

}

function upgradeFacility() {

	if ( selectedFacility ) {

		if ( builtFacilities[ selectedFacility.name ].facilityType === 'Recycling Facility' ) {

			if ( builtFacilities[ selectedFacility.name ].upgradeLevel === 1 ) {

				if ( money.change < facilityDB.recycling[ '2' ].Cost ) {

					logger.add( 'Not Enough Money' );

				} else {

					logger.add( 'Recycling was upgraded to the 2nd level' );
					pollution.change -= facilityDB.recycling[ '2' ].IPR;
					pollution_rate -= facilityDB.recycling[ '2' ].PRS;
					money.change -= facilityDB.recycling[ '2' ].Cost;
					truckSpeed = facilityDB.recycling[ '2' ].speed;
					builtFacilities[ selectedFacility.name ].upgradeLevel = 2;
					builtFacilities[ selectedFacility.name ].IPR = facilityDB.recycling[ '2' ].IPR;
					builtFacilities[ selectedFacility.name ].PRS = facilityDB.recycling[ '2' ].PRS;

				}

			} else if ( builtFacilities[ selectedFacility.name ].upgradeLevel === 2 ) {

				if ( money.change < facilityDB.recycling[ '3' ].Cost ) {

					logger.add( 'Not Enough Money' );

				} else {

					logger.add( 'Recycling was upgraded to the 3rd level' );
					pollution.change -= facilityDB.recycling[ '3' ].IPR;
					pollution_rate -= facilityDB.recycling[ '3' ].PRS;
					money.change -= facilityDB.recycling[ '3' ].Cost;
					truckSpeed = facilityDB.recycling[ '3' ].speed;
					builtFacilities[ selectedFacility.name ].upgradeLevel = 3;
					builtFacilities[ selectedFacility.name ].IPR = facilityDB.recycling[ '3' ].IPR;
					builtFacilities[ selectedFacility.name ].PRS = facilityDB.recycling[ '3' ].PRS;

				}

			} else if ( builtFacilities[ selectedFacility.name ].upgradeLevel === 3 ) {

				logger.add( 'Max level reached' );

			}

		} else if ( builtFacilities[ selectedFacility.name ].facilityType === 'Geothermal' ) {

			if ( builtFacilities[ selectedFacility.name ].upgradeLevel === 1 ) {

				if ( money.change < facilityDB.geothermal[ '2' ].Cost ) {

					logger.add( 'Not Enough Money' );

				} else {

					logger.add( 'Geothermal was upgraded to the 2nd level' );
					tips_logger.plus( facilityDB.geothermal[ '2' ].tips );
					pollution.change -= facilityDB.geothermal[ '2' ].IPR;
					pollution_rate -= facilityDB.geothermal[ '2' ].PRS;
					money.change -= facilityDB.geothermal[ '2' ].Cost;
					builtFacilities[ selectedFacility.name ].upgradeLevel = 2;
					builtFacilities[ selectedFacility.name ].IPR = facilityDB.geothermal[ '2' ].IPR;
					builtFacilities[ selectedFacility.name ].PRS = facilityDB.geothermal[ '2' ].PRS;

				}

			} else if ( builtFacilities[ selectedFacility.name ].upgradeLevel === 2 ) {

				if ( money.change < facilityDB.geothermal[ '3' ].Cost ) {

					logger.add( 'Not Enough Money' );

				} else {

					logger.add( 'Geothermal was upgraded to the 3rd level' );
					tips_logger.plus( facilityDB.geothermal[ '3' ].tips );
					pollution.change -= facilityDB.geothermal[ '3' ].IPR;
					pollution_rate -= facilityDB.geothermal[ '3' ].PRS;
					money.change -= facilityDB.geothermal[ '3' ].Cost;
					builtFacilities[ selectedFacility.name ].upgradeLevel = 3;
					builtFacilities[ selectedFacility.name ].IPR = facilityDB.geothermal[ '3' ].IPR;
					builtFacilities[ selectedFacility.name ].PRS = facilityDB.geothermal[ '3' ].PRS;

				}

			} else if ( builtFacilities[ selectedFacility.name ].upgradeLevel === 3 ) {

				logger.add( 'Max level reached' );

			}

		} else if ( builtFacilities[ selectedFacility.name ].facilityType === 'Wind Turbine' ) {

			if ( builtFacilities[ selectedFacility.name ].upgradeLevel === 1 ) {

				if ( money.change < facilityDB.wind_turbine[ '2' ].Cost ) {

					logger.add( 'Not Enough Money' );

				} else {

					logger.add( 'Wind Turbine was upgraded to the 2nd level' );
					tips_logger.plus( facilityDB.wind_turbine[ '2' ].tips );
					pollution.change -= facilityDB.wind_turbine[ '2' ].IPR;
					pollution_rate -= facilityDB.wind_turbine[ '2' ].PRS;
					money.change -= facilityDB.wind_turbine[ '2' ].Cost;
					builtFacilities[ selectedFacility.name ].upgradeLevel = 2;
					builtFacilities[ selectedFacility.name ].IPR = facilityDB.wind_turbine[ '2' ].IPR;
					builtFacilities[ selectedFacility.name ].PRS = facilityDB.wind_turbine[ '2' ].PRS;

				}

			} else if ( builtFacilities[ selectedFacility.name ].upgradeLevel === 2 ) {

				if ( money.change < facilityDB.wind_turbine[ '3' ].Cost ) {

					logger.add( 'Not Enough Money' );

				} else {

					logger.add( 'Wind Turbine was upgraded to the 3rd level' );
					tips_logger.plus( facilityDB.wind_turbine[ '3' ].tips );
					pollution.change -= facilityDB.wind_turbine[ '3' ].IPR;
					pollution_rate -= facilityDB.wind_turbine[ '3' ].PRS;
					money.change -= facilityDB.wind_turbine[ '3' ].Cost;
					builtFacilities[ selectedFacility.name ].upgradeLevel = 3;
					builtFacilities[ selectedFacility.name ].IPR = facilityDB.wind_turbine[ '3' ].IPR;
					builtFacilities[ selectedFacility.name ].PRS = facilityDB.wind_turbine[ '3' ].PRS;

				}

			} else if ( builtFacilities[ selectedFacility.name ].upgradeLevel === 3 ) {

				logger.add( 'Max level reached' );

			}

		} else if ( builtFacilities[ selectedFacility.name ].facilityType === 'Solar Panel' ) {

			if ( builtFacilities[ selectedFacility.name ].upgradeLevel === 1 ) {

				if ( money.change < facilityDB.solar_panel[ '2' ].Cost ) {

					logger.add( 'Not Enough Money' );

				} else {

					logger.add( 'Solar Panel was upgraded to the 2nd level' );
					tips_logger.plus( facilityDB.solar_panel[ '2' ].tips );
					pollution.change -= facilityDB.solar_panel[ '2' ].IPR;
					pollution_rate -= facilityDB.solar_panel[ '2' ].PRS;
					money.change -= facilityDB.solar_panel[ '2' ].Cost;
					builtFacilities[ selectedFacility.name ].upgradeLevel = 2;
					builtFacilities[ selectedFacility.name ].IPR = facilityDB.solar_panel[ '2' ].IPR;
					builtFacilities[ selectedFacility.name ].PRS = facilityDB.solar_panel[ '2' ].PRS;

				}

			} else if ( builtFacilities[ selectedFacility.name ].upgradeLevel === 2 ) {

				if ( money.change < facilityDB.solar_panel[ '3' ].Cost ) {

					logger.add( 'Not Enough Money' );

				} else {

					logger.add( 'Solar Panel was upgraded to the 3rd level' );
					tips_logger.plus( facilityDB.solar_panel[ '3' ].tips );
					pollution.change -= facilityDB.solar_panel[ '3' ].IPR;
					pollution_rate -= facilityDB.solar_panel[ '3' ].PRS;
					money.change -= facilityDB.solar_panel[ '3' ].Cost;
					builtFacilities[ selectedFacility.name ].upgradeLevel = 3;
					builtFacilities[ selectedFacility.name ].IPR = facilityDB.solar_panel[ '3' ].IPR;
					builtFacilities[ selectedFacility.name ].PRS = facilityDB.solar_panel[ '3' ].PRS;

				}

			} else if ( builtFacilities[ selectedFacility.name ].upgradeLevel === 3 ) {

				logger.add( 'Max level reached' );

			}

		} else if ( builtFacilities[ selectedFacility.name ].facilityType === 'Biomass Factory' ) {

			if ( builtFacilities[ selectedFacility.name ].upgradeLevel === 1 ) {

				if ( money.change < facilityDB.biomass[ '2' ].Cost ) {

					logger.add( 'Not Enough Money' );

				} else {

					logger.add( 'Biomass Factory was upgraded to the 2nd level' );
					tips_logger.plus( facilityDB.biomass[ '2' ].tips );
					pollution.change -= facilityDB.biomass[ '2' ].IPR;
					pollution_rate -= facilityDB.biomass[ '2' ].PRS;
					money.change -= facilityDB.biomass[ '2' ].Cost;
					builtFacilities[ selectedFacility.name ].upgradeLevel = 2;
					builtFacilities[ selectedFacility.name ].IPR = facilityDB.biomass[ '2' ].IPR;
					builtFacilities[ selectedFacility.name ].PRS = facilityDB.biomass[ '2' ].PRS;

				}

			} else if ( builtFacilities[ selectedFacility.name ].upgradeLevel === 2 ) {

				if ( money.change < facilityDB.biomass[ '3' ].Cost ) {

					logger.add( 'Not Enough Money' );

				} else {

					logger.add( 'Biomass Factory was upgraded to the 3rd level' );
					tips_logger.plus( facilityDB.biomass[ '3' ].tips );
					money.change -= facilityDB.biomass[ '3' ].Cost;
					pollution.change -= facilityDB.biomass[ '3' ].IPR;
					pollution_rate -= facilityDB.biomass[ '3' ].PRS;
					builtFacilities[ selectedFacility.name ].upgradeLevel = 3;
					builtFacilities[ selectedFacility.name ].IPR = facilityDB.biomass[ '3' ].IPR;
					builtFacilities[ selectedFacility.name ].PRS = facilityDB.biomass[ '3' ].PRS;

				}

			} else if ( builtFacilities[ selectedFacility.name ].upgradeLevel === 3 ) {

				logger.add( 'Max level reached' );

			}

		} else if ( builtFacilities[ selectedFacility.name ].facilityType === 'Park' ) {

			if ( builtFacilities[ selectedFacility.name ].upgradeLevel === 1 ) {

				if ( money.change < facilityDB.park[ '2' ].Cost ) {

					logger.add( 'Not Enough Money' );

				} else {

					logger.add( 'Park was upgraded to the 2nd level' );
					tips_logger.plus( facilityDB.park[ '2' ].tips );
					pollution.change -= facilityDB.park[ '2' ].IPR;
					pollution_rate -= ( facilityDB ).park[ '2' ].PRS;
					money.change -= facilityDB.park[ '2' ].Cost;
					builtFacilities[ selectedFacility.name ].upgradeLevel = 2;
					builtFacilities[ selectedFacility.name ].IPR = facilityDB.park[ '2' ].IPR;
					builtFacilities[ selectedFacility.name ].PRS = facilityDB.park[ '2' ].PRS;

				}

			} else if ( builtFacilities[ selectedFacility.name ].upgradeLevel === 2 ) {

				if ( money.change < facilityDB.park[ '3' ].Cost ) {

					logger.add( 'Not Enough Money' );

				} else {

					logger.add( 'Park was upgraded to the 3rd level' );
					tips_logger.plus( facilityDB.park[ '3' ].tips );
					pollution.change -= facilityDB.park[ '3' ].IPR;
					pollution_rate -= ( facilityDB ).park[ '3' ].PRS;
					money.change -= facilityDB.park[ '3' ].Cost;
					builtFacilities[ selectedFacility.name ].upgradeLevel = 3;
					builtFacilities[ selectedFacility.name ].IPR = facilityDB.park[ '3' ].IPR;
					builtFacilities[ selectedFacility.name ].PRS = facilityDB.park[ '3' ].PRS;

				}

			} else if ( builtFacilities[ selectedFacility.name ].upgradeLevel === 3 ) {

				logger.add( 'Max level reached' );

			}

		}

		showFacilityInfo( selectedFacility );

	} else {

		logger.add( 'No upgradable facility selected' );

	}

}

const p_level_response = document.getElementById( 'p_level_response' );
const money_response = document.getElementById( 'money_response' );
const block3 = document.getElementById( 'block3' );
const time_response = document.getElementById( 'time_response' );
function pollution_listener() {

	pollution = {
		aInternal: 1500,
		aListener: function ( val ) {},
		set change( val ) {

			this.aInternal = val;
			this.aListener( val );

		},
		get change() {

			return this.aInternal;

		},
		registerListener: function ( listener ) {

			this.aListener = listener;

		}
	};
	pollution.registerListener( function ( val ) {

		//alert("Someone changed the value of value.change to " + val);
		p_level_response.textContent = val.toFixed( 0 );

	} );

}

pollution_listener();
function money_listener() {

	money = {
		aInternal: 5000,
		aListener: function ( val ) {},
		set change( val ) {

			this.aInternal = val;
			this.aListener( val );

		},
		get change() {

			return this.aInternal;

		},
		registerListener: function ( listener ) {

			this.aListener = listener;

		}
	};
	money.registerListener( function ( val ) {

		money_response.textContent = val.toFixed( 0 );

	} );

}

money_listener();
const upVector = new THREE.Vector3( 0, 1, 0 );
const camDirection = new THREE.Vector3();
let dLightVector = new THREE.Vector3();
const targetVector = new THREE.Vector3( 375, 250, 262 );
if ( renderer.capabilities.isWebGL2 ) {

	console.log( 'webgl2 active!!!!' );

}

const listener1 = new THREE.AudioListener();
camera.add( listener1 );
const sound1 = new THREE.Audio( listener1 );
const audioLoader1 = new THREE.AudioLoader();
audioLoader1.load( 'resources/audio/bgMusic.mp3', function ( buffer ) {

	sound1.setBuffer( buffer );
	sound1.setVolume( 0.02 );
	sound1.setLoop( true );
	sound1.autoplay = true;
	sound1.play();

} );

const listener = new THREE.AudioListener();
camera.add( listener );
const sound = new THREE.PositionalAudio( listener );
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'resources/audio/truck.mp3', function ( buffer ) {

	sound.setLoop( true );
	sound.setBuffer( buffer );
	sound.setVolume( 0.1 );
	sound.setRefDistance( 200 );
	sound.autoplay = true;
	sound.play();

} );

export { scene };
THREE.DefaultLoadingManager.onLoad = function ( ) {

	scene.traverse( function ( node ) {

		if ( node.isMesh ) {

			node[ 'prevMaterial' ] = new THREE.MeshToonMaterial( { map: node.material.map,
				color: 0xaaf4f4, side: THREE.FrontSide } );

		}

	} );
	transformableMeshes[ 0 ].position.set( - 30, 0, 0 );
	transformableMeshes[ 1 ].position.set( - 360, 0, - 225 );
	transformableMeshes[ 2 ].position.set( 448, 37, 38 );
	transformableMeshes[ 2 ].scale.set( 2, 2, 2 );

	truck.add( sound );

	logger.add( 'Game Loaded. Have Fun!' );
	remainingTime( 300, time_response );
	requestAnimationFrame( gameLoop );

};
