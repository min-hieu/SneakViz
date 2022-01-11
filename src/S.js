import * as THREE from 'three'
import { useState } from 'react'
import { useTexture } from '@react-three/drei'
import * as d3 from 'd3'
import XS from './data/test_umap3d_new.csv'
import M from './data/sampled_color_umap3d.csv'
import L from './data/sampled_color_umap3d_2.csv'
import XL from './data/large_test_umap3d.csv'
import XLrgb from './data/large_test_umap3d_rgb.csv'
import branded from './data/sampled_brand_umap3d.csv'
import branded3 from './data/sampled_brand3_umap3d.csv'
import colorCorrect from './data/color_corrected_umap3d.csv'

import shoe from './img/shoe.jpeg'

const selectCol = "#ff3d7b"
const shoeSize = colorCorrect

const makeCloud = async () => {
  const geometry = new THREE.BufferGeometry();
  const color = new THREE.Color();

  const positions = [];
  const colors = [];

  const data = await d3.csv(shoeSize)

  for (let i=0;i<data.length;i++) {
    let p = data[i]
    positions.push( p.x, p.y, p.z );
    color.setStyle(p.color)
    colors.push( color.r, color.g, color.b );
  }

  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
  geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

  return geometry
}


export {
  makeCloud
}
