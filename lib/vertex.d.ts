import { NDArray } from '@bluemath/common';
import { HalfEdge } from './halfedge';
export declare type walkHandler = (he: HalfEdge, count: number) => void;
export declare class Vertex {
    coord?: NDArray;
    halfedge?: HalfEdge;
    id: string;
    constructor(coord?: NDArray, halfedge?: HalfEdge);
    walk(heStart: HalfEdge, callback: walkHandler): void;
    degree(): number;
    unlink(): void;
}
