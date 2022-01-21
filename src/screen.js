import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { MakeCloud } from './datapoint'
import { 
	VRCanvas,
	DefaultXRControllers,
	Hands,
	useController,
	Interactive,
	useXRFrame,
	RayGrab,
} from '@react-three/xr'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'

const styles = {
  canvas: {
    height: "100vh",
    width: "100vw",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
}

const CloudMesh = ({geo, mat}) => {
	const ref = useRef()
	const [pressed, setPressed] = useState(false)
	const [startSeq, setStartSeq] = useState(0)
	const rightCon = useController("right")
	const leftCon = useController("left")

	useFrame((state, delta) => {
		if (pressed) {
			ref.current.scale.x += 11
			ref.current.scale.y *= 0.9
			ref.current.scale.z *= 0.9
		}

		if (startSeq == 0) {
			ref.current.scale.x = 0.001
			ref.current.scale.y = 0.001
			ref.current.scale.z = 0.001
			setStartSeq(1)
		}
		if (startSeq == 1) {
			ref.current.scale.x *= 1.1
			ref.current.scale.y *= 1.1
			ref.current.scale.z *= 1.1
			if (ref.current.scale.x > 2) {
				setStartSeq(2)
			}
		}
	})
	
	return (
		<Interactive
			onSelectStart={(e) => setPressed(true)}
			onSelectEnd={() => setPressed(false)} 
		>
			<points geometry={geo} material={mat} ref={ref}/>
		</Interactive>
	)
}

export default function Screen() {
  const cloudData = useMemo(() => MakeCloud({shoeType: "shape"}), [])
  const [cloud, setCloud] = useState(null)
  const [loadStatus, setLoadStatus] = useState(null);
	

  useEffect(() => {
    cloudData.then((data) => {
			setCloud(data)
      setLoadStatus(1)
      console.log("loaded!")
    })
  }, [cloudData])

  if (loadStatus === null) {
    return (
      <div style={styles.loading}>
        loading data ⌛️
      </div>
    )
  } else {
		return (
			<>
				<VRCanvas
					linear
					gl={{ antialias: true, alpha: false }}
					style={styles.canvas}
					camera={{
						fov: 999,
						position: [0, 0, 7],
						far: 100000,
					}}
					mode="concurrent"
					onCreated={(args) => {
						args.gl.setClearColor('white')
						void document.body.appendChild(VRButton.createButton(args.gl))
					}}
				>
					<OrbitControls autoRotate={true} autoRotateSpeed={2}/>
					<DefaultXRControllers />
					<Hands />
					<ambientLight intensity={0.3} />
					<pointLight position={[0, 5, 5]} intensity={1} />

						<CloudMesh geo={ cloud.geo } mat={ cloud.mat }/>
				</VRCanvas>
			</>
		)
	}
}