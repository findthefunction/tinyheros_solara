import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeCanvas = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current?.appendChild(renderer.domElement);

        // Load texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load('/map.png', (tex) => {
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(1, 1);
        });

        // Adding a globe
        const geometry = new THREE.SphereGeometry(5, 512, 512);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe);

        camera.position.z = 15; // Adjust camera distance to view the globe clearly

        // Animation loop
        const animate = function () {
            requestAnimationFrame(animate);

            globe.rotation.y += 0.005; // Rotate the globe for better effect

            renderer.render(scene, camera);
        };

        animate();

        // Handle resizing
        const handleResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            mountRef.current?.removeChild(renderer.domElement);
            scene.clear();
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} />;
};

export default ThreeCanvas;
