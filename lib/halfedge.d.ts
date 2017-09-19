import { Vertex } from './vertex';
import { Loop } from './loop';
import { Edge } from './edge';
export declare type heWalkHandler = (he: HalfEdge, count: number) => void;
export declare class HalfEdge {
    vertex?: Vertex;
    prev?: HalfEdge;
    next?: HalfEdge;
    edge?: Edge;
    loop?: Loop;
    id: string;
    constructor(origin?: Vertex, pair?: HalfEdge, next?: HalfEdge, loop?: Loop);
    mate(): HalfEdge;
    unlink(): void;
    isSolitary(): boolean;
    prevInLoop(): HalfEdge | undefined;
    static walk(heStart: HalfEdge, callback: heWalkHandler): void;
}
