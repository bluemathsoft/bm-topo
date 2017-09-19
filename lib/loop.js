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
var idman_1 = require("./idman");
var Loop = /** @class */ (function () {
    function Loop(face) {
        this.face = face;
        this.id = 'L' + idman_1.IDManager.genId('L');
    }
    Loop.prototype.insertHalfEdgeAfter = function (heNew, heExisting) {
        var next = heExisting.next;
        heExisting.next = heNew;
        heNew.prev = heExisting;
        heNew.next = next;
        next.prev = heNew;
    };
    Loop.prototype.removeHalfEdge = function (he) {
        // Note:
        // We are not going to make any checks if the input halfedge actually
        // belongs to this loop or not
        console.assert(he.prev);
        console.assert(he.next);
        he.prev.next = he.next;
        he.next.prev = he.prev;
        he.next = undefined;
        he.prev = undefined;
    };
    Object.defineProperty(Loop.prototype, "length", {
        get: function () {
            var n = 0;
            halfedge_1.HalfEdge.walk(this.halfedge, function () { n++; });
            return n;
        },
        enumerable: true,
        configurable: true
    });
    Loop.prototype.unlink = function () {
    };
    Loop.prototype.toString = function () {
        var s = this.id + ': ';
        halfedge_1.HalfEdge.walk(this.halfedge, function (he) { s += he.id + ' '; });
        return s;
    };
    return Loop;
}());
exports.Loop = Loop;
