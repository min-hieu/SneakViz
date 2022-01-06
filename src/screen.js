import React, { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, } from '@react-three/fiber'
import { useTexture, OrbitControls, FlyControls, PointerLockControls } from '@react-three/drei'
import shoes from './data/test_umap3d.csv'
import * as d3 from 'd3'

const selectCol = "#ff3d7b"
const handleHoverOver = (e) => {
  e.intersections[0].object.material.color.set( selectCol )
  console.log(e.intersections[0].object == e.object)
}

const handleHoverOut = (e,col) => {
  console.log(e)
  e.intersections[0]?.object.material.color.set( selectCol )
  e.object.material.color.set(col)
  console.log(col)
}

const S = ({col,pos}) => {
  const [hover, setHover] = useState(false)
  const size = 0.5

  useFrame(({ camera, scene }, delta) => {
  })

  return (
    <sprite
      position={pos}
      onPointerOver={(e) => handleHoverOver(e,setHover)}
      onPointerOut={(e) => handleHoverOut(e,col)}
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

const setupSmallUmap = () => {
  let sprites = []
  let i = 0
  d3.csv(shoes, (point) => {
    let key = "s" + i
    i += 1
    sprites.push(
      <S key={key} pos={[point.x,point.y,point.z]} col={point.color}/>
    )
  });
  sprites.push(
    <S key={"center"} pos={[0,0,0]} col={"#0F0"}/>
  )
  return sprites;
}

const canvasH = "80vh"

const Screen = () => {
  const [select, setSelect] = useState()
  const [sprites, setSprites] = useState(setupSmallUmap(12))
  const [spin, setSpin] = useState(0);

  return (
    <>
      <Suspense>
        <Canvas
          style={{
            height: canvasH,
            background: "white",
          }}
          camera={{
            fov: 999,
            position: [0, 0, 6]
          }}
        >
          <OrbitControls
            autoRotate={true}
            autoRotateSpeed={spin}
          />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          {sprites}
        </Canvas>
      </Suspense>
      <button onClick={(e) => setSprites(createRandomSprite(12))}>
        Shuffle
      </button>
      <button onClick={(e) => setSpin(spin?0:4)}>
        Spin Switch
      </button>
    </>
  )
}

export default Screen
