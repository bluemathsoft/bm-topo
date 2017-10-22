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
var Face = /** @class */ (function () {
    function Face(body) {
        this.body = body;
        this.iloops = [];
        this.id = 'F' + idman_1.IDManager.genId('F');
    }
    Face.prototype.addLoop = function (loop) {
        this.iloops.push(loop);
    };
    Face.prototype.removeLoop = function (loop) {
        var idx = this.iloops.indexOf(loop);
        console.assert(idx >= 0);
        this.iloops.splice(idx, 1);
    };
    Face.prototype.setOuterloop = function (loop) {
        this.oloop = loop;
    };
    Face.prototype.unlink = function () {
    };
    Face.prototype.findHalfEdge = function (vtxFrom, vtxTo) {
        for (var i = 0; i < this.iloops.length; i++) {
            var loop = this.iloops[i];
            var he = loop.halfedge;
            console.assert(he);
            do {
                if (he.vertex === vtxFrom) {
                    if (vtxTo) {
                        console.assert(he.next);
                        if (he.next.vertex === vtxTo) {
                            return he;
                        }
                    }
                    else {
                        return he;
                    }
                }
                he = he.next;
            } while (he !== loop.halfedge);
        }
        return undefined;
    };
    return Face;
}());
exports.Face = Face;
