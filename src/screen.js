import React, { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, } from '@react-three/fiber'
import { useTexture, OrbitControls } from '@react-three/drei'


const S = ({col,pos}) => {
  const [hover, setHover] = useState(false)
  const [theta, setTheta] = useState(0)

  useFrame(({ camera, scene }, delta) => {
    setTheta(theta + .01)
    camera.position.x = 5 * Math.sin(theta)
    camera.position.z = 5 * Math.cos(theta)
    camera.lookAt(scene.position)
  })

  return (
    <sprite
      position={pos}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}
    >
      <spriteMaterial
        color={hover ? "#FFF" : col}
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

const canvasH = "80vh"

const Rotate = () => {

  return (
    <>
    </>
  )
}

const Screen = () => {
  const [sprites, setSprites] = useState(createRandomSprite(12))

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
          <OrbitControls/>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          {sprites}
        </Canvas>
      </Suspense>
      <button onClick={(e) => setSprites(createRandomSprite(12))}>
        Shuffle
      </button>
    </>
  )
}

export default Screen