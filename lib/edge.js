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
var Edge = /** @class */ (function () {
    function Edge() {
        this.id = 'E' + idman_1.IDManager.genId('E');
    }
    Edge.prototype.startVertex = function () {
        console.assert(this.hePlus);
        console.assert(this.hePlus.vertex);
        return this.hePlus.vertex;
    };
    Edge.prototype.endVertex = function () {
        console.assert(this.heMinus);
        console.assert(this.heMinus.vertex);
        return this.heMinus.vertex;
    };
    Edge.prototype.unlink = function () {
    };
    return Edge;
}());
exports.Edge = Edge;
