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

import {NDArray} from '@bluemath/common'
import {HalfEdge} from './halfedge'
import {IDManager} from './idman'

export type walkHandler = (he:HalfEdge, count:number) => void;

export class Vertex {

  coord? : NDArray;
  halfedge? : HalfEdge;
  id : string;

  constructor(coord?:NDArray, halfedge?:HalfEdge) {
    this.coord = coord;
    this.halfedge = halfedge;
    this.id = 'V'+IDManager.genId('V');
  }

  walk(heStart:HalfEdge, callback:walkHandler) {
    console.assert(heStart.vertex === this);
    let count = 0;
    let heCursor = heStart;
    do {
      callback(heCursor, count);
      console.assert(heCursor.mate().next);
      heCursor = heCursor.mate().next!;
      count++;
    } while(heCursor !== heStart);
  }

  degree() : number {
    let he = this.halfedge;
    console.assert(he);
    if(he!.isSolitary()) {
      return 0;
    }
    let i=0;
    do {
      i++;
      he = he!.mate().next;
    } while(he !== this.halfedge);
    return i;
  }

  unlink() {
    this.halfedge = undefined;
  }
}
