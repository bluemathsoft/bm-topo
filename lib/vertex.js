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
