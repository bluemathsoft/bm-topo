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

import {HalfEdge} from './halfedge'
import {Face} from './face'
import {IDManager} from './idman'

export class Loop {

  face : Face;
  halfedge? : HalfEdge;
  id : string;

  constructor(face:Face) {
    this.face = face;
    this.id = 'L'+IDManager.genId('L');
  }

  insertHalfEdgeAfter(heNew:HalfEdge, heExisting:HalfEdge) {
    let next = heExisting.next;
    heExisting.next = heNew;
    heNew.prev = heExisting;
    heNew.next = next;
    next!.prev = heNew;
  }

  removeHalfEdge(he:HalfEdge) {
    // Note:
    // We are not going to make any checks if the input halfedge actually
    // belongs to this loop or not
    console.assert(he.prev);
    console.assert(he.next);
    he.prev!.next = he.next;
    he.next!.prev = he.prev;

    he.next = undefined;
    he.prev = undefined;
  }

  get length() {
    let n = 0;
    HalfEdge.walk(this.halfedge!, () => {n++});
    return n;
  }

  unlink() {

  }

  toString() {
    let s = this.id+': ';
    HalfEdge.walk(this.halfedge!, he => {s += he.id+' '});
    return s;
  }

}
