import * as THREE from 'three'
import * as d3 from 'd3'
import { useFrame, useRef } from 'react'

import color from './data/color_umap.csv'
import shape from './data/shape_umap.csv'
import joint from './data/joint_umap.csv'
import test from './data/color_umap_test.csv'

import atlas from './img/atlas.png'
import { colors } from '@mui/material'
import { AiOutlineConsoleSql } from 'react-icons/ai'


const texture = new THREE.TextureLoader().load( atlas )
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;

const material = new THREE.PointsMaterial({ 
	map: texture,
	size: 0.07,
	transparent: true, 
	alphaTest: 0.5,
})

const indexParsChunk = [
	'attribute float vIndex;',
	'varying float texIndex;',
	'#include <common>'
].join( '\n' );

const indexChunk = [
	'#include <begin_vertex>',
	'\ttexIndex = vIndex;'
].join( '\n' );

const fragmentParsChunk = [
	'varying float texIndex;',
	'#include <common>'
].join( '\n' );

const offsetChunk = `
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif

	#ifdef USE_MAP
		float offsetX = mod(texIndex,150.) / 150.;
		float offsetY = -floor(texIndex/150.) / 150. - 1./150.;
		diffuseColor *= texture2D( map, uv/150. + vec2(offsetX,offsetY) );
	#endif

	#ifdef USE_ALPHAMAP
		diffuseColor.a *= texture2D( alphaMap, uv ).g;
	#endif
`

material.onBeforeCompile = function ( shader ) {

	shader.vertexShader = shader.vertexShader
		.replace( '#include <common>', indexParsChunk )
		.replace( '#include <begin_vertex>', indexChunk );

	shader.fragmentShader = shader.fragmentShader
		.replace( '#include <common>', fragmentParsChunk )
		.replace( '#include <map_particle_fragment>', offsetChunk );

};

export async function MakeCloud({ shoeType }) {
	
  const geometry = new THREE.BufferGeometry()

  const positions = []
  const texIndices = []

  const shoeData = 
    shoeType === "color" ? color : 
    shoeType === "shape" ? shape :
    shoeType === "joint" ? joint : 
		shoeType === "test" ? test : null 

  const data = await d3.csv(shoeData)

  for (let i=0;i<data.length;i++) {
    let p = data[i]
		if (p.colorful == 'True') {
			positions.push( p.x, p.y, p.z )
			texIndices.push( p.index )
		}
  }

  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) )
  geometry.setAttribute( 'vIndex', new THREE.Float32BufferAttribute( texIndices, 1 ) )

  return {geo: geometry, mat: material}
}


export async function MakeCloudDynamic({ shoeType }) {
	
  const shoeData = 
    shoeType === "color" ? color : 
    shoeType === "shape" ? shape :
    shoeType === "joint" ? joint : 
		shoeType === "test" ? test : null 

  const data = await d3.csv(shoeData)
	const years = {};


  for (let i=0;i<data.length;i++) {
    let p = data[i]
		if (p.year != 'N/A') {
			if (p.year in years) {
				years[p.year].positions.push( p.x, p.y, p.z )
				years[p.year].texIndices.push( p.index )
			} else {
				years[p.year] = {
					positions: [ p.x, p.y, p.z],
					texIndices: [ p.index ]
				}
			}
			
		}
  }

	let temporalMesh = {}

	for (let i=0;i<Object.keys(years).length;i++) {
		let year = Object.keys(years)[i]
		let geometry = new THREE.BufferGeometry()
		let texture = new THREE.TextureLoader().load( atlas )
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;

		geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( years[year].positions, 3 ) )
  	geometry.setAttribute( 'vIndex', new THREE.Float32BufferAttribute( years[year].texIndices, 1 ) )

		temporalMesh[year] = {
			geo: geometry,
			mat: material
		}
	}

  return temporalMesh
}