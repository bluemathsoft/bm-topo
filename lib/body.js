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
var vertex_1 = require("./vertex");
var edge_1 = require("./edge");
var halfedge_1 = require("./halfedge");
var face_1 = require("./face");
var idman_1 = require("./idman");
var Body = /** @class */ (function () {
    function Body() {
        this.vertices = [];
        this.halfedges = [];
        this.edges = [];
        this.faces = [];
        this.id = 'B' + idman_1.IDManager.genId('B');
    }
    Body.prototype.newFace = function () {
        var face = new face_1.Face(this);
        this.faces.push(face);
        return face;
    };
    Body.prototype.newVertex = function (coord) {
        var vertex = new vertex_1.Vertex(coord);
        this.vertices.push(vertex);
        return vertex;
    };
    Body.prototype.newHalfEdge = function () {
        var he = new halfedge_1.HalfEdge();
        this.halfedges.push(he);
        return he;
    };
    Body.prototype.newEdge = function () {
        var e = new edge_1.Edge();
        this.edges.push(e);
        return e;
    };
    Body.prototype.removeEdge = function (edge) {
        var idx = this.edges.indexOf(edge);
        console.assert(idx >= 0);
        this.edges.splice(idx, 1);
    };
    Body.prototype.removeVertex = function (vertex) {
        var idx = this.vertices.indexOf(vertex);
        console.assert(idx >= 0);
        this.vertices.splice(idx, 1);
    };
    Body.prototype.removeHalfEdge = function (halfEdge) {
        var idx = this.halfedges.indexOf(halfEdge);
        console.assert(idx >= 0);
        this.halfedges.splice(idx, 1);
    };
    Body.prototype.removeFace = function (face) {
        var idx = this.faces.indexOf(face);
        console.assert(idx >= 0);
        this.faces.splice(idx, 1);
    };
    Body.prototype.unlink = function () {
        this.faces.forEach(function (f) { return f.unlink(); });
        this.vertices.forEach(function (v) { return v.unlink(); });
        this.edges.forEach(function (e) { return e.unlink(); });
        this.halfedges.forEach(function (he) { return he.unlink(); });
        this.faces.splice(0);
        this.vertices.splice(0);
        this.edges.splice(0);
        this.halfedges.splice(0);
    };
    Body.prototype.toDOT = function () {
        var s = '';
        s += 'digraph Body {\n';
        s += '  ranksep=.5;ratio=compress;\n';
        s += '  {\n';
        s += '    node[shape=plaintext];\n';
        s += '    Faces->Loops->Vertices;\n';
        s += '  }\n';
        s += '  {\n';
        s += '    rank=same; Vertices;';
        for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
            var vertex = _a[_i];
            s += vertex.id + ';';
        }
        s += '  }\n';
        // s += '  {\n';
        // s += '    rank=same; Edges;';
        // for(let edge of this.edges) {
        //   s += edge.id+';';
        // }
        // s += '  }\n';
        var lps = '{ rank=same; Loops;';
        s += '  {\n';
        s += '    rank=same; Faces;';
        for (var _b = 0, _c = this.faces; _b < _c.length; _b++) {
            var face = _c[_b];
            s += face.id + ';';
            for (var _d = 0, _e = face.iloops; _d < _e.length; _d++) {
                var loop = _e[_d];
                lps += loop.id + ';';
            }
            if (face.oloop) {
                lps += face.oloop.id + ';';
            }
        }
        s += '\n';
        s += '  }\n';
        lps += ' }';
        s += lps + '\n';
        for (var _f = 0, _g = this.vertices; _f < _g.length; _f++) {
            var vertex = _g[_f];
            console.assert(vertex.halfedge);
            s += vertex.id + '->' + vertex.halfedge.id + ';';
        }
        for (var _h = 0, _j = this.faces; _h < _j.length; _h++) {
            var face = _j[_h];
            for (var _k = 0, _l = face.iloops; _k < _l.length; _k++) {
                var loop = _l[_k];
                s += face.id + '->' + loop.id + ';';
            }
            if (face.oloop) {
                s += face.id + '->' + face.oloop.id + '[label=OL];';
            }
        }
        for (var _m = 0, _o = this.halfedges; _m < _o.length; _m++) {
            var halfedge = _o[_m];
            if (halfedge.next) {
                s += halfedge.id + '->' + halfedge.next.id + '[label=N,color=blue];';
            }
            if (halfedge.prev) {
                s += halfedge.id + '->' + halfedge.prev.id + '[label=P,color=red];';
            }
            if (halfedge.vertex) {
                s += halfedge.id + '->' + halfedge.vertex.id + '[color=brown];';
            }
            if (halfedge.loop) {
                s += halfedge.id + '->' + halfedge.loop.id + '[color=gray];';
            }
        }
        s += '}';
        return s;
    };
    Body.prototype.toSVG = function (width, height) {
        if (width === void 0) { width = 600; }
        if (height === void 0) { height = 600; }
        var VTX_RADIUS = 3;
        var VTX_STYLE = 'fill:#f88';
        var vtxmarkup = "<g>";
        for (var i = 0; i < this.vertices.length; i++) {
            var x = this.vertices[i].coord.getN(0);
            var y = this.vertices[i].coord.getN(1);
            vtxmarkup += "<circle cx=" + x + " cy=" + (height - y) + " " +
                ("r=" + VTX_RADIUS + " style=\"" + VTX_STYLE + "\"></circle>\n");
        }
        vtxmarkup += "</g>";
        return "<svg width=" + width + " height=" + height + ">\n" +
            vtxmarkup + '\n' +
            "</svg>";
    };
    return Body;
}());
exports.Body = Body;
