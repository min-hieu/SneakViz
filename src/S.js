import * as THREE from 'three'
import { useState } from 'react'
import { useTexture } from '@react-three/drei'
import * as d3 from 'd3'
import XS from './data/test_umap3d_new.csv'
import M from './data/sampled_color_umap3d.csv'
import L from './data/sampled_color_umap3d_2.csv'
import XL from './data/large_test_umap3d.csv'
import XLrgb from './data/large_test_umap3d_rgb.csv'
import branded from './data/sampled_brand_umap3d.csv'
import branded3 from './data/sampled_brand3_umap3d.csv'

import shoe from './img/shoe.jpeg'

const selectCol = "#ff3d7b"
const shoeSize = XLrgb

const S = ({ col,pos }) => {
  const [hover, setHover] = useState(false)
  const size = 0.2

  return (
    <sprite
      position={pos}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
      scale={[size,size,size]}
    >
      <spriteMaterial
        color={hover ? "#F00" : col}
      />
    </sprite>
  )
}


const makeCloud = async () => {
  const geometry = new THREE.BufferGeometry();
  const color = new THREE.Color();

  const positions = [];
  const colors = [];

  const data = await d3.csv(shoeSize)

  for (let i=0;i<data.length;i++) {
    let p = data[i]
    positions.push( p.x, p.y, p.z );
    colors.push( p.r, p.g, p.b );
  }

  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
  geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

  return geometry
}


const makeDemo = () => {
  const particles = 500000;
  const geometry = new THREE.BufferGeometry();
  const color = new THREE.Color();

  const positions = [];
  const colors = [];

  const n = 1000, n2 = n / 2; // particles spread in the cube

  for ( let i = 0; i < particles; i ++ ) {
    // positions
    const x = Math.random() * n - n2;
    const y = Math.random() * n - n2;
    const z = Math.random() * n - n2;
    positions.push( x, y, z );
    // colors
    const vx = ( x / n ) + 0.5;
    const vy = ( y / n ) + 0.5;
    const vz = ( z / n ) + 0.5;
    color.setRGB( vx, vy, vz );
    colors.push( color.r, color.g, color.b );
  }

  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
  geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

  return (
    <points geometry={geometry}>
      <pointsMaterial size={5} vertexColors={true} />
    </points>
  )
}


const createRandomCloud = ( N ) => {
  let sprites = []
  for (let i = 0; i < N; i++) {
    let pos = [Math.random()*4-2,Math.random()*4-2,Math.random()*4-2]
    let col = randomColor()
    let key = "s" + i
    sprites.push(
      <S key={key} pos={pos} col={col}/>
    )
  }
  return sprites
}


const randomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


const setupUmap = () => {
  let sprites = []
  let i = 0
  d3.csv(shoeSize, (point) => {
    let key = "s" + i
    i += 1
    sprites.push(
      <S
        key={key}
        pos={[point.x,point.y,point.z]}
        col={point.color}
      />
    )
  });
  sprites.push(
    <S key={"center"} pos={[0,0,0]} col={"#0F0"}/>
  )
  return sprites;
}

export {
  createRandomCloud,
  setupUmap,
  makeDemo,
  makeCloud
}
