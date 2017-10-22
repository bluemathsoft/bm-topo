/*

Copyright (C) 2017 Jayesh Salvi, Blue Math Software Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import {NDArray,arr} from '@bluemath/common'

import * as topo from '../src'

let Viz = require('viz.js');

function testEulerOpsBodyViz() {
  topo.IDManager.init();
  let pA = arr([100,100]);
  let pB = arr([200,100]);
  let pC = arr([200,200]);
  let pD = arr([100,200]);

  let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(pA);
  let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,pB);
  let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,pC);
  let {vertex:v3,edge:e2} = topo.EulerOps.MEV(f0,v2,pD);

  let {edge:e3,face:f1} = topo.EulerOps.MEF(f0,v1,v2,v3,v2);

  let dot = body.toDOT();
  let img = Viz(dot, {format:"png-image-element"});
  document.body.appendChild(img);

  // document.body.innerHTML = body.toSVG();

}

window.onload = () => {
  testEulerOpsBodyViz();
};
