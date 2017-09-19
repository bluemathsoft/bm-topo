import { HalfEdge } from './halfedge';
import { Vertex } from './vertex';
export declare class Edge {
    hePlus?: HalfEdge;
    heMinus?: HalfEdge;
    curve: any;
    id: string;
    constructor();
    startVertex(): Vertex;
    endVertex(): Vertex;
    unlink(): void;
}
