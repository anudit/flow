import LookupComp from "@/components/LookupComp";
import { Edge, Node } from "reactflow";

export const nodeTypes = {
    'lookupComp': LookupComp,
}
export const makeNodeConfig = (id: string, label: string = '', position = { x: 10, y: 10 }) => {
    return { 
        id, 
        position, 
        data: { label }, 
        type: 'lookupComp', 
        dragHandle: '.custom-drag-handle' 
    }
}
export const makeEdgeConfig = (from: string, to: string) => {
    return { id: `e${from}-${to}`, source: from, target: to }
}

export const initialNodes : Node[] = [
    makeNodeConfig('1')
];
export const initialEdges : Edge[] = [];

