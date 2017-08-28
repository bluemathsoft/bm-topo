 /*

 Copyright (C) 2017 Jayesh Salvi, Blue Math Software Inc.

 This file is part of bluemath.

 bluemath is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 bluemath is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with bluemath. If not, see <http://www.gnu.org/licenses/>.

*/

import {HalfEdge} from './halfedge'
import {Vertex} from './vertex'

export class Edge {

  hePlus? : HalfEdge;
  heMinus? : HalfEdge;

  curve : any; // TODO

  constructor() {

  }

  startVertex() : Vertex {
    console.assert(this.hePlus);
    console.assert(this.hePlus!.vertex);
    return this.hePlus!.vertex!;
  }

  endVertex() : Vertex {
    console.assert(this.heMinus);
    console.assert(this.heMinus!.vertex);
    return this.heMinus!.vertex!;
  }

  unlink() {

  }

}