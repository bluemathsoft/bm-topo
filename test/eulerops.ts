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

import * as topo from '../src'
import {arr} from '@bluemath/common'

export default function testEulerOps() {

  let p0 = arr([100,100]);
  let p1 = arr([200,100]);
  let p2 = arr([200,200]);
  let p3 = arr([100,200]);
  let p4 = arr([0,0]);
  let p5 = arr([300,0]);
  let p6 = arr([300,300]);
  let p7 = arr([0,300]);

  QUnit.module('Euler Ops', () => {
    QUnit.test('MVFS-KVFS', assert => {
      topo.IDManager.init();
      let result = topo.EulerOps.MVFS(p0);

      assert.ok(result.body !== null);
      assert.equal(result.body.faces.length, 1);
      assert.equal(result.body.vertices.length, 1);
      assert.equal(result.body.halfedges.length, 1);
      assert.equal(result.body.edges.length, 0);

      assert.equal(result.vertex.degree(), 0);

      assert.equal(result.face.iloops.length, 1);

      topo.EulerOps.KVFS(result.body);
    });

    /*
      v0  -- e0 --  v1
    */
    QUnit.module('MEV-KEV', () => {
      QUnit.test('1', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(p0);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,p0);

        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 1);
        assert.equal(f0.iloops[0].length, 2);

        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

    /*
      v0  -- e0 --  v1
                    |
                    |
                    e1
                    |
                    |
                    v2
    */
      QUnit.test('2', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(p0);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,p1);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,p2);

        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 1);
        assert.equal(f0.iloops[0].length, 4);

        topo.EulerOps.KEV(e1,v2);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 1);
        assert.equal(f0.iloops[0].length, 2);

        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

    /*
      v0  -- e0 -- v1
                /   |
              /     |
           e2      e1
          /         |
        /           |
      v3           v2
    */
      QUnit.test('3 branch', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(p0);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,p1);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,p2);
        let {vertex:v3,edge:e2} = topo.EulerOps.MEV(f0,v1,p3);

        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 3);
        assert.equal(v2.degree(), 1);
        assert.equal(v3.degree(), 1);
        assert.equal(f0.iloops[0].length, 6);

        topo.EulerOps.KEV(e2,v3);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 1);
        assert.equal(f0.iloops[0].length, 4);

        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

    });

    QUnit.module('MEF-KEF', () => {

      /*
        v0  -- e0 --  v1
          \           |
            \         |
              e2      e1
                 \    |
                   \  |
                      v2
      */
      QUnit.test('3-Edge face', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(p0);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,p1);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,p2);

        let {edge:e2,face:f1} = topo.EulerOps.MEF(f0,v2,v1,v0,v1);

        assert.equal(v0.degree(), 2);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(f0.iloops[0].length, 3);
        assert.equal(f1.iloops[0].length, 3);

        topo.EulerOps.KEF(e2,f1);

        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 1);
        assert.equal(f0.iloops[0].length, 4);

        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

      /*
        v0  -- e0 --  v1
          \           |
            \         |
              e2      e1
                 \    |
                   \  |
                      v2
      */
      QUnit.test('3-Edge face (shorthand)', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(p0);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,p1);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,p2);

        let {edge:e2,face:f1} = topo.EulerOps.MEF(f0,v2,undefined,v0,undefined);

        assert.equal(v0.degree(), 2);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(f0.iloops[0].length, 3);
        assert.equal(f1.iloops[0].length, 3);

        topo.EulerOps.KEF(e2,f1);

        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 1);
        assert.equal(f0.iloops[0].length, 4);

        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

      /*
        v0  -- e0 --  v1
        |             |
        |             |
        e3            e1
        |             |
        |             |
        v3  -- e2 --  v2
      */
      QUnit.test('Rectangular face', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(p0);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,p1);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,p2);
        let {vertex:v3,edge:e2} = topo.EulerOps.MEV(f0,v2,p3);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 1);
        assert.equal(f0.iloops[0].length, 6);

        let {edge:e3,face:f1} = topo.EulerOps.MEF(f0,v0,v1,v3,v2);
        assert.equal(v0.degree(), 2);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(f0.iloops[0].length, 4);
        assert.equal(f1.iloops[0].length, 4);

        topo.EulerOps.KEF(e3,f1);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 1);
        assert.equal(f0.iloops[0].length, 6);

        topo.EulerOps.KEV(e2,v3);
        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

      /*
        v0  -- e0 --  v1
                    / |
                  /   |
              e3      e1
            /         |
          /           |
        v3  -- e2 --  v2
      */
      QUnit.test('Topo 4V4E2F', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(p0);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,p1);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,p2);
        let {vertex:v3,edge:e2} = topo.EulerOps.MEV(f0,v2,p3);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 1);
        assert.equal(f0.iloops[0].length, 6);

        let {edge:e3,face:f1} = topo.EulerOps.MEF(f0,v1,v2,v3,v2);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 3);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(f0.iloops[0].length, 3);
        assert.equal(f1.iloops[0].length, 5);

        topo.EulerOps.KEF(e3,f1);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 1);
        assert.equal(f0.iloops[0].length, 6);

        topo.EulerOps.KEV(e2,v3);
        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

      /*
        v0  -- e0 --  v1
                    / |
                  /   |
              e3      e1
            /         |
          /           |
        v3  -- e2 --  v2
      */
      QUnit.test('Topo 4V4E2F otherdir', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(p0);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,p1);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,p2);
        let {vertex:v3,edge:e2} = topo.EulerOps.MEV(f0,v2,p3);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 1);
        assert.equal(f0.iloops[0].length, 6);

        let {edge:e3,face:f1} = topo.EulerOps.MEF(f0,v3,v2,v1,v2);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 3);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(f0.iloops[0].length, 3);
        assert.equal(f1.iloops[0].length, 5);

        topo.EulerOps.KEF(e3,f1);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 1);
        assert.equal(f0.iloops[0].length, 6);

        topo.EulerOps.KEV(e2,v3);
        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

      /*
       v4 

          \       v0  -- e0 --  v1
           \                  / |
            e3              /   |
              \         e4      e1
               \      /         |
                    /           |
                  v3  -- e2 --  v2
      */
      QUnit.test('Topo 5V5E2F', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(p0);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,p1);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,p2);
        let {vertex:v3,edge:e2} = topo.EulerOps.MEV(f0,v2,p3);
        let {vertex:v4,edge:e3} = topo.EulerOps.MEV(f0,v3,p4);

        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(v4.degree(), 1);
        assert.equal(f0.iloops[0].length, 8);

        let {edge:e4,face:f1} = topo.EulerOps.MEF(f0,v1,v2,v3,v2);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 3);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 3);
        assert.equal(v4.degree(), 1);
        assert.equal(f0.iloops[0].length, 3);
        assert.equal(f1.iloops[0].length, 7);

        topo.EulerOps.KEF(e4,f1);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(v4.degree(), 1);
        assert.equal(f0.iloops[0].length, 8);

        topo.EulerOps.KEV(e3,v4);
        topo.EulerOps.KEV(e2,v3);
        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

      /*
       v4 

          \       v0  -- e0 --  v1
           \                  / |
            e3              /   |
              \         e4      e1
               \      /         |
                    /           |
                  v3  -- e2 --  v2
      */
      QUnit.test('Topo 5V5E2F otherdir', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(p0);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,p1);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,p2);
        let {vertex:v3,edge:e2} = topo.EulerOps.MEV(f0,v2,p3);
        let {vertex:v4,edge:e3} = topo.EulerOps.MEV(f0,v3,p4);

        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(v4.degree(), 1);
        assert.equal(f0.iloops[0].length, 8);

        let {edge:e4,face:f1} = topo.EulerOps.MEF(f0,v3,v2,v1,v2);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 3);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 3);
        assert.equal(v4.degree(), 1);
        assert.equal(f0.iloops[0].length, 3);
        assert.equal(f1.iloops[0].length, 7);

        topo.EulerOps.KEF(e4,f1);
        assert.equal(v0.degree(), 1);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(v4.degree(), 1);
        assert.equal(f0.iloops[0].length, 8);

        topo.EulerOps.KEV(e3,v4);
        topo.EulerOps.KEV(e2,v3);
        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);
        topo.EulerOps.KVFS(body);
      });

      /*
       v4             -- e5 --              v5
          \
            \
              e4                      
                \                   
                  \               
                  v0  -- e0 --  v1
       |          |             |            |
       |          |             |            |
       e8         e3            e1           e6
       |          |             |            |
       |          |             |            |
                  v3  -- e2 --  v2



       v7             -- e7 --               v6
       
      */
      QUnit.test('Topo 8V8E3F', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(p0);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,p1);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,p2);
        let {vertex:v3,edge:e2} = topo.EulerOps.MEV(f0,v2,p3);
        let {edge:e3,face:f1} = topo.EulerOps.MEF(f0,v0,v1,v3,v2);

        let {vertex:v4,edge:e4} = topo.EulerOps.MEV(f1,v0,p4);

        assert.equal(v0.degree(), 3);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(v4.degree(), 1);

        let {vertex:v5,edge:e5} = topo.EulerOps.MEV(f1,v4,p5);
        let {vertex:v6,edge:e6} = topo.EulerOps.MEV(f1,v5,p6);
        let {vertex:v7,edge:e7} = topo.EulerOps.MEV(f1,v6,p7);

        assert.equal(v0.degree(), 3);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(v4.degree(), 2);
        assert.equal(v5.degree(), 2);
        assert.equal(v6.degree(), 2);
        assert.equal(v7.degree(), 1);

        let {edge:e8,face:f2} = topo.EulerOps.MEF(f1,v7,v6,v4,v5);
        assert.equal(v0.degree(), 3);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(v4.degree(), 3);
        assert.equal(v5.degree(), 2);
        assert.equal(v6.degree(), 2);
        assert.equal(v7.degree(), 2);

        topo.EulerOps.KEF(e8,f2);
        assert.equal(v0.degree(), 3);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(v4.degree(), 2);
        assert.equal(v5.degree(), 2);
        assert.equal(v6.degree(), 2);
        assert.equal(v7.degree(), 1);

        topo.EulerOps.KEV(e7,v7);
        topo.EulerOps.KEV(e6,v6);
        topo.EulerOps.KEV(e5,v5);
        topo.EulerOps.KEV(e4,v4);

        topo.EulerOps.KEF(e3,f1);
        topo.EulerOps.KEV(e2,v3);
        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);

        topo.EulerOps.KVFS(body);
      });
    });

    QUnit.module('MEKR-KEMR', () => {
      /*
       v4             -- e5 --              v5
          
            
                                    
                                    
                                  
                  v0  -- e0 --  v1
       |          |             |            |
       |          |             |            |
       e8         e3            e1           e6
       |          |             |            |
       |          |             |            |
                  v3  -- e2 --  v2



       v7             -- e7 --               v6
       
      */
      QUnit.test('Topo 8V8E3F', assert => {
        topo.IDManager.init();
        let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS(p0);
        let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0,p1);
        let {vertex:v2,edge:e1} = topo.EulerOps.MEV(f0,v1,p2);
        let {vertex:v3,edge:e2} = topo.EulerOps.MEV(f0,v2,p3);
        let {edge:e3,face:f1} = topo.EulerOps.MEF(f0,v0,v1,v3,v2);

        let {vertex:v4} = topo.EulerOps.MEV(f1,v0,p4);
        let {vertex:v5,edge:e5} = topo.EulerOps.MEV(f1,v4,p5);
        let {vertex:v6,edge:e6} = topo.EulerOps.MEV(f1,v5,p6);
        let {vertex:v7,edge:e7} = topo.EulerOps.MEV(f1,v6,p7);
        let {edge:e8,face:f2} = topo.EulerOps.MEF(f1,v7,v6,v4,v5);

        assert.equal(f2.iloops.length, 1);
        assert.equal(f2.iloops[0].length, 10);
        assert.equal(v0.degree(), 3);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(v4.degree(), 3);
        assert.equal(v5.degree(), 2);
        assert.equal(v6.degree(), 2);
        assert.equal(v7.degree(), 2);

        topo.EulerOps.KEMR(f2,v0,v4);

        assert.equal(f2.iloops.length, 2);
        assert.equal(f2.iloops[0].length, 4);
        assert.equal(f2.iloops[1].length, 4);
        assert.equal(v0.degree(), 2);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(v4.degree(), 2);
        assert.equal(v5.degree(), 2);
        assert.equal(v6.degree(), 2);
        assert.equal(v7.degree(), 2);

        let oldEdge = topo.EulerOps.MEKR(f2,v3,v0,f2,v4,v7);

        assert.equal(f2.iloops.length, 1);
        assert.equal(f2.iloops[0].length, 10);
        assert.equal(v0.degree(), 3);
        assert.equal(v1.degree(), 2);
        assert.equal(v2.degree(), 2);
        assert.equal(v3.degree(), 2);
        assert.equal(v4.degree(), 3);
        assert.equal(v5.degree(), 2);
        assert.equal(v6.degree(), 2);
        assert.equal(v7.degree(), 2);

        topo.EulerOps.KEF(e8,f2);
        topo.EulerOps.KEV(e7,v7);
        topo.EulerOps.KEV(e6,v6);
        topo.EulerOps.KEV(e5,v5);
        topo.EulerOps.KEV(oldEdge,v4);

        topo.EulerOps.KEF(e3,f1);
        topo.EulerOps.KEV(e2,v3);
        topo.EulerOps.KEV(e1,v2);
        topo.EulerOps.KEV(e0,v1);

        topo.EulerOps.KVFS(body);

        assert.ok(true);
      });
    });
  });
}
