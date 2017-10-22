"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var idman_1 = require("./idman");
var Vertex = /** @class */ (function () {
    function Vertex(coord, halfedge) {
        this.coord = coord;
        this.halfedge = halfedge;
        this.id = 'V' + idman_1.IDManager.genId('V');
    }
    Vertex.prototype.walk = function (heStart, callback) {
        console.assert(heStart.vertex === this);
        var count = 0;
        var heCursor = heStart;
        do {
            callback(heCursor, count);
            console.assert(heCursor.mate().next);
            heCursor = heCursor.mate().next;
            count++;
        } while (heCursor !== heStart);
    };
    Vertex.prototype.degree = function () {
        var he = this.halfedge;
        console.assert(he);
        if (he.isSolitary()) {
            return 0;
        }
        var i = 0;
        do {
            i++;
            he = he.mate().next;
        } while (he !== this.halfedge);
        return i;
    };
    Vertex.prototype.unlink = function () {
        this.halfedge = undefined;
    };
    return Vertex;
}());
exports.Vertex = Vertex;
