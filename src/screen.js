import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { MakeCloud } from './datapoint'
import { 
	VRCanvas,
	DefaultXRControllers,
	Hands,
	useController,
	RayGrab,
	useXRFrame,
	useXREvent,
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
	const [leftSelect, setLeftSelect] = useState(false)
	const [rightSelect, setRightSelect] = useState(false)
	const [scaleFlag, setScaleFlag] = useState(false)
	const [relativeScale, setRelativeScale] = useState(1)
	const [scale, setScale] = useState(2)

	useXREvent(
		'selectstart',
		() => {
			setLeftSelect(true)
		},
		{ handedness: 'left' }
	)

	useXREvent(
		'selectstart',
		() => {
			setRightSelect(true)
		},
		{ handedness: 'right' }
	)

	useXREvent(
		'selectend',
		() => {
			setLeftSelect(false)
			setScale(ref.current.scale.x)
			setScaleFlag(false)
		},
		{ handedness: 'left' }
	)

	useXREvent(
		'selectend',
		() => {
			setRightSelect(false)
			setScale(ref.current.scale.x)
			setScaleFlag(false)
		},
		{ handedness: 'right' }
	)

	useFrame((state, delta) => {
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

	const leftController = useController('left')
	const rightController = useController('right')

	useXRFrame((state, delta) => {
		if (leftSelect && rightSelect) {
			let sum = 0
			let leftie = leftController.controller.position
			let rightie = rightController.controller.position
			sum += Math.pow(leftie.x - rightie.x, 2)
			sum += Math.pow(leftie.y - rightie.y, 2)
			sum += Math.pow(leftie.z - rightie.z, 2)
			let distance = Math.sqrt(sum)
			let newScale = scale * distance / relativeScale

			ref.current.scale.x = newScale
			ref.current.scale.y = newScale
			ref.current.scale.z = newScale

			console.log(newScale)

			// set initial state
			if (scaleFlag === false) {
				setRelativeScale(distance)
				setScaleFlag(true)
			}
		} else if (!leftSelect && !rightSelect) {
			ref.current.rotation.y += 0.0001
		}
	})


	return (
		<RayGrab>
			<points geometry={geo} material={mat} ref={ref}/>
		</RayGrab>
	)
}

export default function Screen() {
  const cloudData = useMemo(() => MakeCloud({shoeType: "shape"}), [])
  const [cloud, setCloud] = useState(null)
  const [loadStatus, setLoadStatus] = useState(null);
	
	// load geometry and texture
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