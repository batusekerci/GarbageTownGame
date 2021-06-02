"use strict";

import * as THREE from "../build/three.module.js";

class Point{
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Node{
	constructor(pt,dist,parent) {
		this.pt = pt;
		this.dist = dist;
		this.parent = parent;
	}
}

let d = [
	{x: -1, y: 0}, //left
	{x: 0, y: -1}, //down
	{x: 0, y: 1},  //up
	{x: 1, y: 0}   //right
];

export function bfs( src_x,src_y, dest_x,dest_y) {

	let src = new Point(src_x,src_y);
	let dest = new Point(dest_x,dest_y);
	let path = [];

	let minDist = -1;
	if (maze[src.x][src.y] !== 1 || maze[dest.x][dest.y] !== 1)
		return minDist;

	let h = maze.length;
	let w = maze[0].length;
	let visited = [];
	for (let i = 0; i < h; i++) {
		visited.push([]);
		for (let j = 0; j < w; j++) {
			visited[i].push(false);
		}
	}
	visited[src.x][src.y]=true;
	let queue = [];
	let s = new Node(src, 0,null);

	queue.push(s);


	while (queue.length>0) {
		let curr = queue.shift();
		let pt = curr.pt;

		if (pt.x === dest.x && pt.y === dest.y){
			getPath(path, src, curr);
			path.push(s);
			path.reverse();
			return pointToVEC2(path);
		}

		for (let i = 0; i < 4; i++) {
			let row = pt.x + d[i].x;
			let col = pt.y + d[i].y;

			if (isValid(maze, visited, h, w, row, col)) {
				visited[row][col] = true;
				let adjCell = new Node(new Point(row, col), curr.dist + 1,curr);
				queue.push(adjCell);
			}
		}
	}
	return minDist;
}

function isValid(maze, visited, width, height, row, col) {
	return (row >= 0) && (row < width) && (col >= 0) &&
		(col < height) && maze[row][col] === 1 && !visited[row][col];
}

function getPath(path,src,target){
	let curr = target;
	while(curr.pt.x !== src.x || curr.pt.y!== src.y){
		path.push(curr);
		curr = curr.parent;
	}
}

function pointToVEC2(path){
	let result = [];

	for(let i=0;i<path.length;i++){
		let x = path[i].pt.x;
		let y = path[i].pt.y;
		let vector = new THREE.Vector2((y-8)*40.5,(x-6)*40.5);
		result.push(vector);
	}
	return result;
}

let maze = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,1,0,1,0,0,0,1,0,1,0,0,1,0,0,1],
	[1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,0,1],
	[1,0,0,0,1,0,1,0,1,0,1,0,0,1,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
	[1,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1],
	[1,0,0,1,1,0,0,0,1,0,1,0,1,0,0,0,1],
	[1,0,0,1,0,0,0,0,1,0,1,0,1,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1],
	[1,0,1,1,1,1,1,1,1,0,0,0,1,1,1,0,1],
	[1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,1]
];

export function randGrid(currentR, currentC) {
	let r = Math.floor(Math.random() * 13);
	let c = Math.floor(Math.random() * 17);
	while (maze[r][c] === 0 || (r===currentR && c ===currentC)) {
		r = Math.floor(Math.random() * 13);
		c = Math.floor(Math.random() * 17);
	}
	return [r,c];
}
