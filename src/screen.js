import React, { useState, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { useTexture, OrbitControls, FlyControls, PointerLockControls } from '@react-three/drei'
import { makeCloud } from './S'
import frame from './img/frame.png'

const styles = {
  canvas: {
    height: "100vh",
    width: "132vh",
    background: "white",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
  frame: {
    position: "absolute",
    top: 0,
    height: "100vh",
    left: "50%",
    transform: "translate(-50%, 0)",
    pointerEvents: "none",
  },
  controls: {
    margin: "102vh 0 2vh 0",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    gap: "2vw",
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
        <ambientLight intensity={1}/>
        <pointLight position={[10, 10, 10]} />
        {plot}
        <mesh>
          <sphereBufferGeometry args={[0.1, 30, 30]} attach="geometry" />
          <meshBasicMaterial
            color={0xff0000}
          />
        </mesh>
      </Canvas>
      <img src={frame} style={styles.frame}/>
      <div className="uiControls"
        style={styles.controls}
      >
        <button onClick={(e) => setSpin(spin?0:speed)}>
          Spin Switch
        </button>
        <button onClick={(e) => setPlot(plotDefault)}>
          makeCloud
        </button>
      </div>
    </>
  )
}

export default Screen
