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

import {Vertex} from './vertex'
import {Loop} from './loop'
import {Edge} from './edge'
import {IDManager} from './idman'

export type heWalkHandler = (he:HalfEdge, count:number) => void;

export class HalfEdge {

  vertex? : Vertex;
  prev? : HalfEdge;
  next? : HalfEdge;
  edge? : Edge;
  loop? : Loop;
  id : string;

  constructor(origin?:Vertex, pair?:HalfEdge, next?:HalfEdge, loop?:Loop) {
    this.vertex = origin;
    this.prev = pair;
    this.next = next;
    this.loop = loop;
    this.id = 'HE'+IDManager.genId('HE');
  }

  mate() : HalfEdge {
    console.assert(this.edge);
    if(this.edge!.hePlus === this) {
      console.assert(this.edge!.heMinus);
      return this.edge!.heMinus!;
    } else {
      console.assert(this.edge!.hePlus);
      return this.edge!.hePlus!;
    }
  }

  unlink() {

  }

  isSolitary() {
    return !this.edge;
  }

  prevInLoop() {
    let cursor = this.next;
    console.assert(cursor);
    while(cursor!.next !== this) {
      cursor = cursor!.next;
    }
    return cursor;
  }

  static walk(heStart:HalfEdge, callback:heWalkHandler) {
    let cursor = heStart;
    let count = 0;
    do {
      callback(cursor, count);
      console.assert(cursor.next);
      cursor = cursor.next!;
      count++;
    } while(cursor !== heStart);
  }

}
