import React , {useRef , Suspense} from 'react'
import {Canvas , extend , useFrame , useLoader} from '@react-three/fiber'
import {shaderMaterial} from '@react-three/drei'
import glsl from "babel-plugin-glsl/macro"
import './App.css';
import * as THREE from "three"

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
		float noiseFreq = 1.5;
		float noiseAmp = 0.3;
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
			<Canvas camera={{fov: 12, position: [0,0,5]}} >
				<Suspense fallback={null} >	
					<Wave />
				</Suspense>		
			</Canvas>
		   )
}


const App = () => {

	return (
		<>
			
			<Scene/>
			<h1>The Death of Socrates</h1>
		</>
		   ) 
}

export default App;
