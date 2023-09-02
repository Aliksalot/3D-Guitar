        import * as THREE from 'three';
        import { OrbitControls } from "https://unpkg.com/three@0.155.0/examples/jsm/controls/OrbitControls.js";
        import { GLTFLoader } from "https://unpkg.com/three@0.155.0/examples/jsm/loaders/GLTFLoader.js";
        const guitar_window = document.getElementById('guitar-window')
        const renderer = new THREE.WebGLRenderer({antialias: true});
        
        renderer.setSize(guitar_window.clientWidth, guitar_window.clientHeight)
        guitar_window.appendChild(renderer.domElement)
        
        const camera = new THREE.PerspectiveCamera(30, guitar_window.clientWidth/guitar_window.clientHeight, 0.1, 1000)
        camera.position.set(0,0,0)

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xffffff)

        const amLight = new THREE.AmbientLight(0xffffff)
        scene.add(amLight)


        const loader = new GLTFLoader()

        loader.load('../models/guitar.glb', (gltf) => {
            const model = gltf.scene

            console.log(model)

            const x_offset = parseInt(window.getComputedStyle(guitar_window).left)
            const y_offset = parseInt(window.getComputedStyle(guitar_window).top)

            const screenPosition = new THREE.Vector3(x_offset, y_offset, 0)
            
            screenPosition.unproject(camera)

            model.position.copy(screenPosition)

            /*model.position.set(0,0,0)

            model.position.x += x_offset
            model.position.y += y_offset*/

            const _camera = model.getObjectByName('CameraSubstitute')

            if(_camera === undefined){
                ModelLoadError()
                return
            }

            camera.position.set(_camera.position.x, _camera.position.y, _camera.position.z)
            
            const center = model.getObjectByName('center')

            if(center === undefined){
                ModelLoadError()
                return
            }

            createControls(center.position)

            scene.add(model)

            renderer.render(scene, camera)
        }, undefined, (error) => {
            console.log(error)
        })

        const createControls = (controls_position) => {
            const controls = new OrbitControls(camera, renderer.domElement)
            controls.addEventListener('change', () => {
                console.log(camera.rotation)
                console.log(camera.position)
                renderer.render(scene, camera)            
            })
            controls.target.set(controls_position.x, controls_position.y, controls_position.z)
            controls.update()
        }


        const checkIfOnString = (event) => {

            const x_offset = event.clientX - parseInt(window.getComputedStyle(guitar_window).left)
            const y_offset = event.clientY - parseInt(window.getComputedStyle(guitar_window).top)

            const mouse = new THREE.Vector2()

            mouse.x = (x_offset / guitar_window.clientWidth) * 2 - 1
            mouse.y = - (y_offset / guitar_window.clientHeight) * 2 + 1

            const raycaster = new THREE.Raycaster()

            raycaster.setFromCamera(mouse, camera);
    
            const intersects = raycaster.intersectObjects(scene.children);

            if(intersects.length > 0){
                intersects.forEach(intersect => {
                    if(intersect.object.name.indexOf('String') !== -1){
                        const string = intersect.object
                        onStringEnter(string)            
                    }
                })
            }
        }



        const onStringEnter = (string) => {
            string.material.color.r = 100
            console.log(string.material.color.r)
            renderer.render(scene, camera)   
            setInterval(changeToBlack, 1500, string)
        }

        const changeToBlack = (string) => {
            string.material.color.r = 0;
            renderer.render(scene, camera)   
        }

        function onWindowResize() {
            camera.aspect = guitar_window.clientWidth / guitar_window.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(guitar_window.clientWidth, guitar_window.clientHeight);
        }

        window.addEventListener('resize', onWindowResize)
        guitar_window.addEventListener('mousemove', checkIfOnString)
