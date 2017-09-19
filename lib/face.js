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
