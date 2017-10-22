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
