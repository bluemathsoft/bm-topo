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

import * as topo from '../../src/topo'

export default function testEulerOps() {
  QUnit.module('Euler Ops', () => {
    QUnit.test('MVFS-KVFS', assert => {
      let result = topo.EulerOps.MVFS();
      assert.ok(result.body !== null);
      assert.equal(result.body.faces.length, 1);
      assert.equal(result.body.faces[0].iloops.length, 1);
      assert.equal(result.body.vertices.length, 1);
      assert.equal(result.body.halfedges.length, 1);
      assert.equal(result.body.edges.length, 0);
      topo.EulerOps.KVFS(result.body);
    });
  });
}