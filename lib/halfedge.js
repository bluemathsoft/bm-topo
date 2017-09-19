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
var HalfEdge = /** @class */ (function () {
    function HalfEdge(origin, pair, next, loop) {
        this.vertex = origin;
        this.prev = pair;
        this.next = next;
        this.loop = loop;
        this.id = 'HE' + idman_1.IDManager.genId('HE');
    }
    HalfEdge.prototype.mate = function () {
        console.assert(this.edge);
        if (this.edge.hePlus === this) {
            console.assert(this.edge.heMinus);
            return this.edge.heMinus;
        }
        else {
            console.assert(this.edge.hePlus);
            return this.edge.hePlus;
        }
    };
    HalfEdge.prototype.unlink = function () {
    };
    HalfEdge.prototype.isSolitary = function () {
        return !this.edge;
    };
    HalfEdge.prototype.prevInLoop = function () {
        var cursor = this.next;
        console.assert(cursor);
        while (cursor.next !== this) {
            cursor = cursor.next;
        }
        return cursor;
    };
    HalfEdge.walk = function (heStart, callback) {
        var cursor = heStart;
        var count = 0;
        do {
            callback(cursor, count);
            console.assert(cursor.next);
            cursor = cursor.next;
            count++;
        } while (cursor !== heStart);
    };
    return HalfEdge;
}());
exports.HalfEdge = HalfEdge;
