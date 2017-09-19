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
