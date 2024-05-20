import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import TWEEN from '@tweenjs/tween.js';

const ThreeCanvas = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [raycaster] = useState(new THREE.Raycaster());
    const [mouse] = useState(new THREE.Vector2());
    const [camera] = useState(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));

    useEffect(() => {
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0); // Background color transparent
        mountRef.current?.appendChild(renderer.domElement);

        const scene = new THREE.Scene();

        const globe = new THREE.Mesh(
            new THREE.SphereGeometry(5, 32, 32),
            new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('/map.png') })
        );
        scene.add(globe);

        camera.position.z = 15;
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.autoRotate = false; // Disable auto-rotate

        const animate = function () {
            requestAnimationFrame(animate);
            TWEEN.update();
            globe.rotation.y += 0.002; // Slow rotation of the globe
            renderer.render(scene, camera);
        };
        animate();

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', onWindowResize);

        function zoomToPoint(target) {
            controls.enabled = false; // Disable controls during animation
            new TWEEN.Tween(camera.position)
                .to({
                    x: target.x * 1.1, // Slightly closer than the point
                    y: target.y * 1.1,
                    z: target.z * 1.1
                }, 2000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(() => camera.lookAt(globe.position))
                .onComplete(() => {
                    const url = determineUrlFromCoordinates(target);
                    window.location.href = url;
                    controls.enabled = true; // Re-enable controls after animation
                })
                .start();
        }

        function determineUrlFromCoordinates(target) {
            // Add logic to determine URL based on target or use a fixed URL for example
            return '/destination-link'; // Placeholder
        }

        function onDocumentMouseDown(event) {
            event.preventDefault();

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);

            intersects.forEach(intersect => {
                if (intersect.object === globe) {
                    zoomToPoint(intersect.point);
                }
            });
        }
        document.addEventListener('mousedown', onDocumentMouseDown);

        return () => {
            window.removeEventListener('resize', onWindowResize);
            document.removeEventListener('mousedown', onDocumentMouseDown);
            mountRef.current?.removeChild(renderer.domElement);
            scene.clear();
            renderer.dispose();
        };
    }, [camera, raycaster, mouse]);

    return <div ref={mountRef} />;
};

export default ThreeCanvas;
