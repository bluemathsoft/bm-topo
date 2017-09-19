import { HalfEdge } from './halfedge';
import { Face } from './face';
export declare class Loop {
    face: Face;
    halfedge?: HalfEdge;
    id: string;
    constructor(face: Face);
    insertHalfEdgeAfter(heNew: HalfEdge, heExisting: HalfEdge): void;
    removeHalfEdge(he: HalfEdge): void;
    readonly length: number;
    unlink(): void;
    toString(): string;
}
