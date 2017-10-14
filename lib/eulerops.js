"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var halfedge_1 = require("./halfedge");
var body_1 = require("./body");
var loop_1 = require("./loop");
var EulerOps = /** @class */ (function () {
    function EulerOps() {
    }
    /**
     * Make Vertex Face Solid
     * (Solid = Body in this library)
     */
    EulerOps.MVFS = function (coord) {
        var body = new body_1.Body();
        var vertex = body.newVertex(coord);
        var face = body.newFace();
        var loop = new loop_1.Loop(face);
        face.addLoop(loop);
        var he = body.newHalfEdge();
        he.next = he;
        he.prev = he;
        he.loop = loop;
        he.vertex = vertex;
        loop.halfedge = he;
        vertex.halfedge = he;
        return { body: body, vertex: vertex, face: face };
    };
    /**
     * Kill Vertex Face Solid
     * (Solid = Body in this library)
     */
    EulerOps.KVFS = function (body) {
        body.unlink();
    };
    /**
     * Low level MEV (Make Edge Vertex)
     */
    EulerOps.LMEV = function (he0, he1, coord) {
        console.assert(he0.loop);
        var body = he0.loop.face.body;
        var vertex = body.newVertex(coord);
        var edge = body.newEdge();
        if (he0 === he1) {
            var he2 = body.newHalfEdge();
            he2.loop = he0.loop;
            he2.vertex = vertex;
            he0.loop.insertHalfEdgeAfter(he2, he0);
            vertex.halfedge = he2;
            edge.hePlus = he0;
            edge.heMinus = he2;
            he0.edge = edge;
            he2.edge = edge;
        }
        else {
            var he2 = body.newHalfEdge();
            var he3 = body.newHalfEdge();
            he2.loop = he0.loop;
            he3.loop = he0.loop;
            he2.vertex = he0.vertex;
            he3.vertex = vertex;
            he0.loop.insertHalfEdgeAfter(he2, he1);
            he0.loop.insertHalfEdgeAfter(he3, he2);
            vertex.halfedge = he3;
            edge.hePlus = he3;
            edge.heMinus = he2;
            he3.edge = edge;
            he2.edge = edge;
        }
        return { vertex: vertex, edge: edge };
    };
    /**
     * Make Edge Vertex
     */
    EulerOps.MEV = function (face, vertex, coord) {
        var he0 = face.findHalfEdge(vertex);
        console.assert(he0);
        var he1 = he0.isSolitary() ? he0 : he0.prevInLoop();
        console.assert(he1);
        return EulerOps.LMEV(he0, he1, coord);
    };
    /**
     * Kill Edge Vertex
     */
    EulerOps.KEV = function (edge, vertex) {
        console.assert(edge.hePlus);
        var loop = edge.hePlus.loop;
        console.assert(loop);
        var face = loop.face;
        console.assert(face);
        var body = face.body;
        console.assert(edge.hePlus);
        console.assert(edge.heMinus);
        if (edge.hePlus.next === edge.heMinus) {
            // KEV should remove only the MINUS halfedge
            // The PLUS halfedge will remain behind as solitary
            // - Remove MINUS halfedge
            var heToRemove = edge.heMinus;
            var heToSurvive = edge.hePlus;
            heToRemove.next = undefined; // TODO - can this be done in unlink of HE?
            heToRemove.prev = undefined;
            heToRemove.edge = undefined;
            heToRemove.loop = undefined;
            heToRemove.vertex = undefined;
            // - Make PLUS solitary halfedge
            edge.hePlus.next = edge.hePlus;
            edge.hePlus.prev = edge.hePlus;
            edge.hePlus.edge = undefined;
            if (loop.halfedge === heToRemove) {
                loop.halfedge = heToSurvive;
            }
            edge.unlink();
            body.removeEdge(edge);
            vertex.unlink();
            body.removeVertex(vertex);
            body.removeHalfEdge(heToRemove);
        }
        else {
            // KEV should remove both of its halfedges
            if (loop.halfedge === edge.hePlus) {
                loop.halfedge = edge.hePlus.next;
            }
            loop.removeHalfEdge(edge.hePlus);
            if (loop.halfedge === edge.heMinus) {
                loop.halfedge = edge.heMinus.next;
            }
            loop.removeHalfEdge(edge.heMinus);
            edge.hePlus.unlink();
            edge.heMinus.unlink();
            body.removeHalfEdge(edge.heMinus);
            body.removeHalfEdge(edge.hePlus);
            edge.unlink();
            vertex.unlink();
            body.removeEdge(edge);
            body.removeVertex(vertex);
        }
    };
    /**
     * Make Edge Face
     */
    EulerOps.MEF = function (face, fromHEV0, fromHEV1, toHEV0, toHEV1) {
        var heFrom = face.findHalfEdge(fromHEV0, fromHEV1);
        var heTo = face.findHalfEdge(toHEV0, toHEV1);
        console.assert(heFrom);
        console.assert(heTo);
        var vFrom = fromHEV0;
        var vTo = toHEV0;
        var body = face.body;
        // heFrom and heTo are halfedges emanating from the vertices between which
        // we want to place the new edge. These vertices will be vFrom, vTo resp.
        var newEdge = body.newEdge();
        var newFace = body.newFace();
        var newLoop = new loop_1.Loop(newFace);
        newFace.addLoop(newLoop);
        var hePlus = body.newHalfEdge();
        var heMinus = body.newHalfEdge();
        newEdge.hePlus = hePlus;
        newEdge.heMinus = heMinus;
        hePlus.edge = heMinus.edge = newEdge;
        hePlus.vertex = vFrom;
        heMinus.vertex = vTo;
        // TODO : is this criteria of oldLoop always correct?
        console.assert(vFrom.halfedge);
        var oldLoop = vFrom.halfedge.loop;
        console.assert(oldLoop);
        // Conventions
        // -----------
        // hePlus goes from vFrom to vTo
        // heMinus goes from vTo to vFrom
        // hePlus will be part of the new loop
        // heMinus will be part of the old loop
        // hePlus->mNext = heTo; // ?
        // heFrom->mate()->mNext = hePlus;
        // heMinus->mNext = heFrom; // ?
        // heTo->mate()->mNext = heMinus;
        // How to assign next pointers of hePlus and heMinus to place them in 
        // newLoop and oldLoop resp.
        //
        // First we will fit heMinus in oldLoop. We start walking the oldLoop.
        // A walk will visit each vertex twice (right?)
        // We walk until we visit vTo. At vTo, we remember the halfEdge reaching
        // to vTo along oldLoop (heMinusPrev).
        // We continue to walk. If we visit vTo again, before visiting vFrom we
        // update the heMinusPrev to the halfedge that brought us to vTo this time.
        // We continue the walk until we visit vFrom.
        // We call the halfedge leaving vFrom along oldLoop heMinusNext.
        //
        // In summary, we are walking the oldloop and find two nearest halfedges
        // in that loop between which we can fit heMinus.
        // Now we assign hePrev->next = heMinus and heMinus->next = heNext
        //
        // Later we are going to short-circuit the old loop between these two
        // half edges.
        var heCursor = oldLoop.halfedge;
        console.assert(heCursor);
        var heMinusPrev = null;
        var heMinusNext = null;
        do {
            if (!heMinusNext) {
                console.assert(heCursor.next);
                if (heCursor.next.vertex === vTo) {
                    heMinusPrev = heCursor;
                }
            }
            if (heMinusPrev) {
                if (heCursor.vertex === vFrom) {
                    heMinusNext = heCursor;
                    break;
                }
            }
            heCursor = heCursor.next;
            console.assert(heCursor);
        } while (heCursor !== hePlus);
        console.assert(heMinusNext);
        console.assert(heMinusPrev);
        var shortCircuitFrom = heMinusNext.prev;
        var shortCircuitTo = undefined; // = heMinusPrev.mate()
        var refHE = heMinusPrev.mate();
        console.assert(refHE.vertex);
        refHE.vertex.walk(refHE, function (he) {
            if (he.loop === oldLoop) {
                shortCircuitTo = he;
            }
        });
        console.assert(shortCircuitFrom);
        console.assert(shortCircuitTo);
        heMinus.next = heMinusNext;
        heMinusNext.prev = heMinus;
        heMinusPrev.next = heMinus;
        heMinus.prev = heMinusPrev;
        // Short circuit the old loop between two halfedges between which we
        // are inserting the new edge (and its new loop and face)
        shortCircuitFrom.next = hePlus;
        shortCircuitTo.prev = hePlus;
        // As for hePlus's prev and next halfedges, we call derive them from
        // heFrom and heTo as follows
        // hePlus.next = heTo;
        // heFrom.mate().next = hePlus;
        // hePlus.prev = heFrom.mate();
        // heTo.prev = hePlus;
        hePlus.next = shortCircuitTo;
        hePlus.prev = shortCircuitFrom;
        heMinus.loop = newLoop;
        hePlus.loop = oldLoop;
        // Start traversing half-edges from heMinus and assign them to newLoop
        var hePtr = heMinus;
        do {
            hePtr.loop = newLoop;
            hePtr = hePtr.next;
            console.assert(hePtr);
        } while (hePtr !== heMinus);
        newLoop.halfedge = heMinus;
        oldLoop.halfedge = hePlus;
        return { edge: newEdge, face: newFace };
    };
    /**
     * Kill Edge Face
     */
    EulerOps.KEF = function (edge, face) {
        console.assert(face.iloops.length === 1);
        var loopToKill = face.iloops[0];
        console.assert(loopToKill);
        var loopToSurvive;
        console.assert(edge.hePlus && edge.heMinus);
        if (edge.hePlus.loop === loopToKill) {
            loopToSurvive = edge.heMinus.loop;
        }
        else {
            loopToSurvive = edge.hePlus.loop;
        }
        console.assert(loopToSurvive);
        console.assert(loopToSurvive.halfedge);
        loopToSurvive.halfedge = loopToSurvive.halfedge.next;
        console.assert(loopToKill.halfedge);
        halfedge_1.HalfEdge.walk(loopToKill.halfedge, function (he) {
            he.loop = loopToSurvive;
        });
        console.assert(edge.hePlus.prev && edge.heMinus.prev &&
            edge.hePlus.next && edge.heMinus.next);
        edge.hePlus.prev.next = edge.heMinus.next;
        edge.heMinus.prev.next = edge.hePlus.next;
        edge.hePlus.next.prev = edge.heMinus.prev;
        edge.heMinus.next.prev = edge.hePlus.prev;
        edge.hePlus.unlink();
        edge.heMinus.unlink();
        edge.hePlus.next = undefined;
        edge.hePlus.prev = undefined;
        edge.heMinus.next = undefined;
        edge.heMinus.prev = undefined;
        var body = face.body;
        body.removeHalfEdge(edge.hePlus);
        body.removeHalfEdge(edge.heMinus);
        edge.unlink();
        body.removeEdge(edge);
        body.removeFace(face);
        face.unlink();
    };
    /**
     * Kill Edge Make Ring
     * (Ring = Loop in this library)
     */
    EulerOps.KEMR = function (face, v1, v2) {
        var hePos = face.findHalfEdge(v1, v2);
        console.assert(hePos);
        var heNeg = hePos.mate();
        var edgeToKill = hePos.edge;
        console.assert(edgeToKill);
        var oldLoop = hePos.loop;
        console.assert(oldLoop);
        var heNextInNewLoop = hePos.next;
        var hePrevInOldLoop = hePos.prevInLoop();
        var heNextInOldLoop = hePos.mate().next;
        var hePrevInNewLoop = hePos.mate().prevInLoop();
        console.assert(heNextInNewLoop);
        console.assert(hePrevInNewLoop);
        console.assert(heNextInOldLoop);
        console.assert(hePrevInOldLoop);
        hePrevInNewLoop.next = heNextInNewLoop;
        hePrevInOldLoop.next = heNextInOldLoop;
        heNextInNewLoop.prev = hePrevInNewLoop;
        heNextInOldLoop.prev = hePrevInOldLoop;
        var ring = new loop_1.Loop(face);
        face.addLoop(ring);
        // Old loop becomes the outer loop of face (needs reconsideration later)
        face.setOuterloop(oldLoop);
        var heCursor = hePos.next;
        do {
            heCursor.loop = ring;
            heCursor = heCursor.next;
        } while (heCursor !== hePos.next);
        ring.halfedge = hePos.next;
        console.assert(hePos.vertex);
        if (hePos.vertex.halfedge === hePos) {
            hePos.vertex.halfedge = hePrevInOldLoop.mate();
        }
        console.assert(heNeg.vertex);
        if (heNeg.vertex.halfedge == heNeg) {
            heNeg.vertex.halfedge = heNextInNewLoop;
        }
        oldLoop.halfedge = hePrevInOldLoop;
        hePos.next = undefined;
        hePos.prev = undefined;
        heNeg.next = undefined;
        hePos.prev = undefined;
        heNeg.unlink();
        hePos.unlink();
        edgeToKill.unlink();
        face.body.removeEdge(edgeToKill);
        face.body.removeHalfEdge(hePos);
        face.body.removeHalfEdge(heNeg);
        return ring;
    };
    /**
     * Make Edge Kill Ring
     * (Ring = Loop in this library)
     */
    EulerOps.MEKR = function (faceFrom, fromHEV0, fromHEV1, faceTo, toHEV0, toHEV1) {
        var heFrom = faceFrom.findHalfEdge(fromHEV0, fromHEV1);
        var heTo = faceTo.findHalfEdge(toHEV0, toHEV1);
        var body = faceFrom.body;
        console.assert(heFrom);
        console.assert(heTo);
        var heFromNextInOuterLoop = heFrom.next;
        console.assert(heFromNextInOuterLoop);
        var heToPrevInRing = heTo.prevInLoop();
        console.assert(heToPrevInRing);
        var outerLoop = heFrom.loop;
        var ringToKill = heTo.loop;
        console.assert(ringToKill);
        var heCursor = heTo;
        do {
            heCursor.loop = outerLoop;
            heCursor = heCursor.next;
            console.assert(heCursor);
        } while (heCursor !== heTo);
        var hePos = body.newHalfEdge();
        var heNeg = body.newHalfEdge();
        var edge = body.newEdge();
        edge.hePlus = hePos;
        edge.heMinus = heNeg;
        hePos.edge = edge;
        heNeg.edge = edge;
        heFrom.next = heNeg;
        heNeg.next = heTo;
        heToPrevInRing.next = hePos;
        hePos.next = heFromNextInOuterLoop;
        heNeg.prev = heFrom;
        heTo.prev = heNeg;
        hePos.prev = heToPrevInRing;
        heFromNextInOuterLoop.prev = hePos;
        hePos.loop = outerLoop;
        heNeg.loop = outerLoop;
        hePos.vertex = toHEV0;
        heNeg.vertex = fromHEV1;
        ringToKill.face.removeLoop(ringToKill);
        ringToKill.unlink();
        return edge;
    };
    return EulerOps;
}());
exports.EulerOps = EulerOps;
