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
var IDManager = /** @class */ (function () {
    function IDManager() {
    }
    IDManager.init = function () {
        var labels = ['B', 'V', 'E', 'F', 'L', 'HE'];
        IDManager.idmap = {};
        for (var _i = 0, labels_1 = labels; _i < labels_1.length; _i++) {
            var label = labels_1[_i];
            IDManager.idmap[label] = -1;
        }
    };
    IDManager.genId = function (label) {
        console.assert(IDManager.idmap[label] !== undefined);
        IDManager.idmap[label] += 1;
        return IDManager.idmap[label];
    };
    return IDManager;
}());
exports.IDManager = IDManager;
