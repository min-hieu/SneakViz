import React, { useState, useEffect, useMemo, useRef } from 'react'
import Slider from '@mui/material/Slider'
import { styled } from '@mui/material/styles'
import { GrPowerReset } from 'react-icons/gr'
import { MdRepeat, MdPause, MdPlayArrow } from 'react-icons/md'
import './styles/Screen.css'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { MakeCloud, MakeCloudDynamic } from './datapoint'
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
import { clear } from '@testing-library/user-event/dist/clear'

const styles = {
  canvas: {
    height: "80vh",
    width: "100%",
    borderStyle: "solid",
    borderRadius: "0.5rem",
    borderWidth: "0.1rem",
  },
  loading: {
  },
}

const CloudMesh = ({geo, mat}) => {
  const ref = useRef()
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
    // if (startSeq == 0) {
    //  ref.current.scale.x = 0.001
    //  ref.current.scale.y = 0.001
    //  ref.current.scale.z = 0.001
    //  setStartSeq(1)
    // }
    // if (startSeq == 1) {
    //  ref.current.scale.x *= 1.1
    //  ref.current.scale.y *= 1.1
    //  ref.current.scale.z *= 1.1
    //  if (ref.current.scale.x > 2) {
    //    setStartSeq(2)
    //  }
    // }
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

const StyledSlider = styled(Slider)({
  color: '#610606',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 18,
    width: 18,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 10,
    background: 'unset',
    padding: 0,
    width: 28,
    height: 28,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#610606',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
});

const vrBtnStyle = vrBtn => {
    vrBtn.style.position = 'absolute'
    vrBtn.style.bottom = '20px'
    vrBtn.style.border = '1px solid rgb(255, 255, 255)'
    vrBtn.style.borderRadius = '4px'
    vrBtn.style.background = 'rgba(1, 1, 1, 0.3)'
    vrBtn.style.color = 'rgb(255, 255, 255)'
    // vrBtn.style.font: 13px sans-serif; */
    vrBtn.style.textAlign = 'center'
    vrBtn.style.opacity = '1'
    vrBtn.style.outline = 'none'
    vrBtn.style.zIndex = '999'
    vrBtn.style.cursor = 'auto'
    // vrBtn.style.left: calc(50% - 75px); */
    // vrBtn.style.width: 150px;

    return vrBtn
}

export function StaticScreen() {
  const cloudData = useMemo(() => MakeCloud({shoeType: "test"}), [])
  const [cloud, setCloud] = useState(null)
  const [loadStatus, setLoadStatus] = useState(null);
  const [spin, setSpin] = useState(0)
  const viewRef = useRef()

  const staticControlBar =
    <div className='controlBar'>
      <span className='controlText'>spin speed</span>
      <StyledSlider 
        id='controlSlider'
        defaultValue={1} 
        min={-8} 
        max={8}
        valueLabelDisplay="auto"
        onChange={(e)=>{
          setSpin(e.target.value)
        }}
      />
      <MdRepeat 
        onClick={()=>viewRef.current.reset()}
        className='iconBtn'
      />
    </div>
  
  // load geometry and texture
  useEffect(() => {
    cloudData.then((data) => {
      setCloud(data)
      setLoadStatus(1)
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
        { staticControlBar }
        <VRCanvas
          linear
          gl={{ antialias: true, alpha: false }}
          style={styles.canvas}
          camera={{
            fov: 999,
            position: [0,0,1],
            far: 100000,
          }}
          mode="concurrent"
          onCreated={(args) => {
            args.gl.setClearColor('white')
            let vrBtn = VRButton.createButton(args.gl)
            let cvs = document.getElementById('staticCanvas')
            vrBtn = vrBtnStyle(vrBtn)
            cvs.appendChild(vrBtn)
          }}
          id="staticCanvas"
        >
          <OrbitControls autoRotate={true} autoRotateSpeed={spin/2} ref={viewRef}/>
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

const CloudMeshDynamic = ({ temporalMesh, innerRef } ) => {
  const years = Object.keys(temporalMesh)
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
      // setScale(ref.current.scale.x)
      setScaleFlag(false)
    },
    { handedness: 'left' }
  )

  useXREvent(
    'selectend',
    () => {
      setRightSelect(false)
      // setScale(ref.current.scale.x)
      setScaleFlag(false)
    },
    { handedness: 'right' }
  )

  useFrame((state, delta) => {
    // if (startSeq == 0) {
    //  ref.current.scale.x = 0.001
    //  ref.current.scale.y = 0.001
    //  ref.current.scale.z = 0.001
    //  setStartSeq(1)
    // }
    // if (startSeq == 1) {
    //  ref.current.scale.x *= 1.1
    //  ref.current.scale.y *= 1.1
    //  ref.current.scale.z *= 1.1
    //  if (ref.current.scale.x > 2) {
    //    setStartSeq(2)
    //  }
    // }

  })

  const leftController = useController('left')
  const rightController = useController('right')

  // for scaling object
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

      // ref.current.scale.x = newScale
      // ref.current.scale.y = newScale
      // ref.current.scale.z = newScale

      // set initial state
      if (scaleFlag === false) {
        setRelativeScale(distance)
        setScaleFlag(true)
      }
    } else if (!leftSelect && !rightSelect) {
      // ref.current.rotation.y += 0.0001
    }
  })

  const pointMesh = years.map((year, i) => 
    <points 
      key={i}
      geometry={temporalMesh[year].geo} 
      material={temporalMesh[year].mat} 
      ref={el => innerRef.current[i] = el}
      visible={false}
    />)

  return (
    <RayGrab>
      {pointMesh}
    </RayGrab>
  )
}


export function DynamicScreen() {
  const cloudData = useMemo(() => MakeCloudDynamic({shoeType: "test"}), [])
  const [cloud, setCloud] = useState(null)
  const [loadStatus, setLoadStatus] = useState(null)
  const [playFlag, setPlayFlag] = useState(true)
  const [spin, setSpin] = useState(0)
  const [year, setYear] = useState(0)
  const ref = useRef([]) // for shoe cloud object
  const viewRef = useRef() // for resetting view

  const dynamicControlBar =
    <div className='controlBar'>
      <span className='controlText'>spin speed</span>
      <StyledSlider 
        id='controlSliderDynamic'
        defaultValue={1} 
        min={-8} 
        max={8}
        valueLabelDisplay="auto"
        onChange={(e)=>{
          setSpin(e.target.value)
        }}
      />
      <MdRepeat 
        onClick={()=>viewRef.current.reset()}
        className='iconBtn'
      />
      { playFlag
      ? <MdPause 
          onClick={()=>setPlayFlag(false)} 
          className='iconBtn'
          style={{marginLeft: 'auto'}}
        /> 
      : <> 
        <MdPlayArrow 
          onClick={()=>setPlayFlag(true)} 
          className='iconBtn'
          style={{marginLeft: 'auto'}}
        />
        <StyledSlider 
          id='controlSliderTimer'
          defaultValue={2003} 
          min={1999} 
          max={2020}
          valueLabelDisplay="auto"
          onChange={(e)=>{
            setYear(e.target.value - 1999)
          }}
        />
      </>}
    </div>
  
  useEffect(() => {
    if ( loadStatus ) {
      if (playFlag) {
        let interval = setInterval(() => {
            ref.current.map((o)=>o.visible=false)
            ref.current[year].visible = true
            setYear((year+1)%22)
        }, 800) 
        return () => clearInterval(interval);
      } else {
        ref.current.map((o)=>o.visible=false)
        ref.current[year].visible = true
      }
    }
  }, [loadStatus, playFlag, year])
  
  // load geometry and texture
  useEffect(() => {
    cloudData.then((data) => {
      setCloud(data)
      setLoadStatus(1)
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
        { dynamicControlBar }
        <VRCanvas
          linear
          gl={{ antialias: true, alpha: false }}
          style={styles.canvas}
          camera={{
            fov: 999,
            position: [0, 0, 2],
            far: 100000,
          }}
          mode="concurrent"
          onCreated={(args) => {
            args.gl.setClearColor('white')
            let vrBtn = VRButton.createButton(args.gl)
            let cvs = document.getElementById('dynamicCanvas')
            vrBtn = vrBtnStyle(vrBtn)
            cvs.appendChild(vrBtn)
          }}
          id="dynamicCanvas"
        >
          <OrbitControls autoRotate={true} autoRotateSpeed={spin} ref={viewRef}/>
          <DefaultXRControllers />
          <Hands />
          <ambientLight intensity={0.3} />
          <pointLight position={[0, 5, 5]} intensity={1} />
          <CloudMeshDynamic temporalMesh={cloud} innerRef={ref}/>
        </VRCanvas>
      </>
    )
  }
}
