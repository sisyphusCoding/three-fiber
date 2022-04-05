import React , {useState,useRef , Suspense} from 'react'
import {Canvas , extend , useFrame , useLoader} from '@react-three/fiber'
import {shaderMaterial} from '@react-three/drei'
import glsl from "babel-plugin-glsl/macro"
import './App.css';
import * as THREE from "three"
import {useTransition , animated } from 'react-spring'
const WaveShaderMaterial = shaderMaterial (

		{uTime : 0 , uColor: new THREE.Color(0 , 0 , 0) , uTexture: new THREE.Texture()},

		glsl`
		precision mediump float;
		uniform float uTime;

		varying vec2 vUv;
		varying float vWave;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)


		void main () {
		vUv = uv;

		vec3 pos = position;
		float noiseFreq = 2.5;
		float noiseAmp = 0.25;
		vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y , pos.z );
		pos.z += snoise3(noisePos) * noiseAmp;
		vWave = pos.z  ;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(pos , 1.0);

		}
`,


	glsl `
	precision mediump float;
	uniform vec3 uColor;
	uniform float uTime;
	uniform sampler2D uTexture;
	varying vec2 vUv;
	varying float vWave;

	void main(){
		float wave = vWave * 0.04;		
		vec3 texture = texture2D(uTexture  , vUv + wave).rgb;		
		gl_FragColor = vec4( texture , 1.0);
	}
`

)

extend({WaveShaderMaterial})

	const Wave = () => {

		const textureImage = require('./socrates.jpeg');
		const ref = useRef();
		useFrame(({clock}) => (ref.current.uTime = clock.getElapsedTime()));


		const [image] = useLoader(THREE.TextureLoader , [textureImage] )

			return (
					<mesh>
					<planeBufferGeometry args={[1.2,.8,100,100]}/>
					<waveShaderMaterial ref={ref} uTexture={image} />	
					</mesh>

				   )
	}



const Scene = () => {

	return (
			<Canvas camera={{fov: 11, position: [0,0,5]}} >
			<Suspense fallback={null} >	
			<Wave />
			</Suspense>		
			</Canvas>
		   )
}

const Content = () => {

	return(

			<>
			<h1>The Death of Socrates</h1>
			</>
		  )
}

const App = () => {

	const [okay , setOkay] = useState(false)

	const desc = 'The Greek philosopher Socrates (469–399 B.C.) was convicted of impiety by the Athenian courts; rather than renounce his beliefs, he died willingly, discoursing on the immortality of the soul before drinking poisonous hemlock. Through a network of carefully articulated gestures and expressions, David’s figures act out the last moments of Socrates’s life. He is about to grasp the cup of hemlock, offered by a disciple who cannot bear to witness the act. David consulted antiquarian scholars in his pursuit of an archeologically exacting image, including details of furniture and clothing; his inclusion of Plato at the foot of the bed, however, deliberately references not someone present at Socrates’s death but, rather, the author whose text, Phaedo, had preserved this ancient story into modern times.'

		const transition = useTransition (okay , {
from : { y: -500, opacity: 0},
enter: { y: 0, opacity: 1},
leave: {y: 500 , opacity: 0},
})

return (
		<div className='wrapper' onClick = {()=> {setOkay(v => !v)}} >

		<Scene />

		{transition((style , item)=>
				item ? <animated.span style ={style}>

					<h1>The Death of Socrates</h1>
					<p>{desc}</p>

				</animated.span> : null
				)}
		</div>  
	   ) 
}

export default App;
