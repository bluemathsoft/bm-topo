import { NDArray } from '@bluemath/common';
import { Vertex } from './vertex';
import { Edge } from './edge';
import { HalfEdge } from './halfedge';
import { Face } from './face';
export declare class Body {
    vertices: Vertex[];
    halfedges: HalfEdge[];
    edges: Edge[];
    faces: Face[];
    id: string;
    constructor();
    newFace(): Face;
    newVertex(coord: NDArray): Vertex;
    newHalfEdge(): HalfEdge;
    newEdge(): Edge;
    removeEdge(edge: Edge): void;
    removeVertex(vertex: Vertex): void;
    removeHalfEdge(halfEdge: HalfEdge): void;
    removeFace(face: Face): void;
    unlink(): void;
    toDOT(): string;
    toSVG(width?: number, height?: number): string;
}
