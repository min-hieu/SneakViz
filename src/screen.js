import React, { useState, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { useTexture, OrbitControls, FlyControls, PointerLockControls } from '@react-three/drei'
import { createRandomCloud, setupUmap, makeCloud, makeDemo } from './S'
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
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
}

const speed = 2

const sphere = () => {
  const radius = 8
  return (
    <mesh>
      <sphereGeometry args={[radius, 8, 6]}/>
      <meshBasicMaterial color="#FF0" />
    </mesh>
  )
}


const Screen = () => {
  const cloudGeo = useMemo(() => makeCloud(), [])
  const demoSprite = useMemo(() => makeDemo(), [])
  const slowSprite = useMemo(() => setupUmap(), [])
  const [select, setSelect] = useState()
  const [plot, setPlot] = useState(null)
  const [plotDefault, setPlotDefault] = useState(null)
  const [spin, setSpin] = useState(speed);
  const [loadStatus, setLoadStatus] = useState(null);

  useEffect(() => {
    cloudGeo.then((geometry) => {
      setLoadStatus(1)
      console.log("done loading lol")
      setPlot(
        <points geometry={geometry}>
          <pointsMaterial size={0.1} vertexColors={true} />
        </points>
      )
      setPlotDefault(
        <points geometry={geometry}>
          <pointsMaterial size={0.1} vertexColors={true} />
        </points>
      )
    })
  }, [])

  if (loadStatus === null) {
    return (
      <div style={styles.loading}>
        loading data lol ...
      </div>
    )
  }

  return (
    <>
      <Canvas
        linear
        gl={{ antialias: true, alpha: true }}
        style={styles.canvas}
        camera={{
          fov: 999,
          position: [0, 0, 7],
          far: 100000,
        }}
      >
        <OrbitControls
          autoRotate={true}
          autoRotateSpeed={spin}
        />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {plot}
      </Canvas>
      <img src={frame} style={styles.frame}/>
      <div className="uiControls"
        style={styles.controls}
      >
        <button onClick={(e) => setPlot(createRandomCloud(12))}>
          random
        </button>
        <button onClick={(e) => setSpin(spin?0:speed)}>
          Spin Switch
        </button>
        <button onClick={(e) => setPlot(plotDefault)}>
          makeCloud
        </button>
        <button onClick={(e) => setPlot(demoSprite)}>
          makeDemo
        </button>
        <button onClick={(e) => setPlot(slowSprite)}>
          old
        </button>
      </div>
    </>
  )
}

export default Screen
