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
