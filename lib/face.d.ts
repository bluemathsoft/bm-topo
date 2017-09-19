import { Loop } from './loop';
import { Body } from './body';
import { Vertex } from './vertex';
import { HalfEdge } from './halfedge';
export declare class Face {
    oloop?: Loop;
    iloops: Loop[];
    body: Body;
    surface: any;
    id: string;
    constructor(body: Body);
    addLoop(loop: Loop): void;
    removeLoop(loop: Loop): void;
    setOuterloop(loop: Loop): void;
    unlink(): void;
    findHalfEdge(vtxFrom: Vertex, vtxTo?: Vertex): HalfEdge | undefined;
}
