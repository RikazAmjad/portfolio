import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';

global.self = global;

const fbxPath = process.argv[2] || 'public/character/character_animated.fbx';
const glbPath = process.argv[3] || 'public/character/character_animated.glb';

if (!fs.existsSync(fbxPath)) {
  console.log(`Waiting for FBX file at ${fbxPath}...`);
  process.exit(1);
}

console.log(`Loading FBX from ${fbxPath}...`);
const buf = fs.readFileSync(fbxPath);
const arrayBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

const loader = new FBXLoader();
const object = loader.parse(arrayBuffer, '');

console.log('FBX loaded! Animations count:', object.animations?.length || 0);

console.log(`Exporting to GLB at ${glbPath}...`);
const exporter = new GLTFExporter();
exporter.parse(
  object,
  (result) => {
    fs.writeFileSync(glbPath, Buffer.from(result));
    const size = (fs.statSync(glbPath).size / 1024 / 1024).toFixed(2);
    console.log(`Converted successfully! Saved to ${glbPath} (${size} MB)`);
  },
  (err) => {
    console.error('Export error:', err);
  },
  { binary: true, animations: object.animations }
);

