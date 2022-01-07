import React, { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useTexture, OrbitControls, FlyControls, PointerLockControls } from '@react-three/drei'
import { createRandomSprite, setupUmap } from './S'
import frame from './img/frame.png'

const styles = {
  canvas: {
    height: "74.5vh",
    width: "120vh",
    background: "white",
    position: "absolute",
    top: "8.5vh",
    left: "50%",
    transform: "translate(-50%, 0)",
  },
  frame: {
    position: "absolute",
    top: 0,
    height: "90vh",
    left: "50%",
    transform: "translate(-50%, 0)",
    pointerEvents: "none",
  },
  controls: {
    position: "absolute",
    left: "50%",
    transform: "translate(-50%, 0)",
    bottom: "5vh",
  },
}

const speed = 4

const sphere = () => {
  const radius = 99
  return (
    <mesh>
      <sphereGeometry args={[radius, 8, 6]}/>
      <meshBasicMaterial color="#FF0" />
    </mesh>
  )
}

const Screen = () => {
  const setupSprites = setupUmap()
  const [select, setSelect] = useState()
  const [sprites, setSprites] = useState(setupSprites)
  const [spin, setSpin] = useState(speed);

  return (
    <>
      <Suspense>
        <Canvas
          style={styles.canvas}
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
          <mesh>
            <sphereGeometry args={[9999, 8, 6]}/>
            <meshBasicMaterial color="#FF0" />
          </mesh>
        </Canvas>
      </Suspense>
      <img src={frame} style={styles.frame}/>
      <div className="uiControls"
        style={styles.controls}
      >
        <button onClick={(e) => setSprites(createRandomSprite(12))}>
          Shuffle
        </button>
        <button onClick={(e) => setSpin(spin?0:speed)}>
          Spin Switch
        </button>
        <button onClick={(e) => setSprites(setupSprites)}>
          reset
        </button>
      </div>
    </>
  )
}

export default Screen
