import { Vertex } from './vertex';
import { Face } from './face';
import { Edge } from './edge';
import { Body } from './body';
import { Loop } from './loop';
import { NDArray } from '@bluemath/common';
export declare type MVFS_result = {
    vertex: Vertex;
    body: Body;
    face: Face;
};
export declare type MEV_result = {
    edge: Edge;
    vertex: Vertex;
};
export declare type MEF_result = {
    edge: Edge;
    face: Face;
};
export declare class EulerOps {
    /**
     * Make Vertex Face Solid
     * (Solid = Body in this library)
     */
    static MVFS(coord: NDArray): MVFS_result;
    /**
     * Kill Vertex Face Solid
     * (Solid = Body in this library)
     */
    static KVFS(body: Body): void;
    /**
     * Low level MEV (Make Edge Vertex)
     */
    private static LMEV(he0, he1, coord);
    /**
     * Make Edge Vertex
     */
    static MEV(face: Face, vertex: Vertex, coord: NDArray): {
        vertex: Vertex;
        edge: Edge;
    };
    /**
     * Kill Edge Vertex
     */
    static KEV(edge: Edge, vertex: Vertex): void;
    /**
     * Make Edge Face
     */
    static MEF(face: Face, fromHEV0: Vertex, fromHEV1: Vertex | undefined, toHEV0: Vertex, toHEV1: Vertex | undefined): MEF_result;
    /**
     * Kill Edge Face
     */
    static KEF(edge: Edge, face: Face): void;
    /**
     * Kill Edge Make Ring
     * (Ring = Loop in this library)
     */
    static KEMR(face: Face, v1: Vertex, v2: Vertex): Loop;
    /**
     * Make Edge Kill Ring
     * (Ring = Loop in this library)
     */
    static MEKR(faceFrom: Face, fromHEV0: Vertex, fromHEV1: Vertex, faceTo: Face, toHEV0: Vertex, toHEV1: Vertex): Edge;
}
