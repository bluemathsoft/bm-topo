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

import {Loop} from './loop'
import {Body} from './body'
import {Vertex} from './vertex'
import {HalfEdge} from './halfedge'
import {IDManager} from './idman'

export class Face {

  oloop? : Loop;
  iloops : Loop[];
  body : Body;
  surface : any;
  id : string;

  constructor(body:Body) {
    this.body = body;
    this.iloops = [];
    this.id = 'F'+IDManager.genId('F');
  }

  addLoop(loop:Loop) {
    this.iloops.push(loop);
  }

  removeLoop(loop:Loop) {
    let idx = this.iloops.indexOf(loop);
    console.assert(idx >= 0);
    this.iloops.splice(idx,1);
  }

  setOuterloop(loop:Loop) {
    this.oloop = loop;
  }

  unlink() {

  }


  findHalfEdge(vtxFrom:Vertex, vtxTo?:Vertex) : HalfEdge|undefined {
    for(let i=0; i<this.iloops.length; i++) {
      let loop = this.iloops[i];
      let he = loop.halfedge;
      console.assert(he);
      do {
        if(he!.vertex === vtxFrom) {
          if(vtxTo) {
            console.assert(he!.next);
            if(he!.next!.vertex === vtxTo) {
              return he;
            }
          } else {
            return he;
          }
        }
        he = he!.next;
      } while(he !== loop.halfedge);
    }
    return undefined;
  }
}
