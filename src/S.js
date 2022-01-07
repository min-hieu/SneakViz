import { useState } from 'react'
import { useTexture } from '@react-three/drei'
import * as d3 from 'd3'
import XS from './data/test_umap3d_new.csv'
import M from './data/sampled_color_umap3d.csv'
import L from './data/sampled_color_umap3d_2.csv'
import XL from './data/large_test_umap3d.csv'
import shoe from './img/shoe.jpeg'

const selectCol = "#ff3d7b"
const shoeSize = L


const handleHoverOver = (e) => {
}

const handleHoverOut = (e,setHover) => {
}

const S = ({ col,pos }) => {
  const [hover, setHover] = useState(false)
  const size = 0.2

  return (
    <sprite
      position={pos}
      onPointerOver={(e) => {handleHoverOver(e);setHover(true)}}
      onPointerOut={(e) => {handleHoverOut(e);setHover(false)}}
      scale={[size,size,size]}
    >
      <spriteMaterial
        color={hover ? "#F00" : col}
      />
    </sprite>
  )
}

const createRandomSprite = ( numSprite ) => {
  let sprites = []
  for (let i = 0; i < numSprite; i++) {
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
      <S key={key} pos={[point.x,point.y,point.z]} col={point.color}/>
    )
  });
  sprites.push(
    <S key={"center"} pos={[0,0,0]} col={"#0F0"}/>
  )
  console.log("loading done!")
  return sprites;
}

export {
  createRandomSprite,
  setupUmap
}
