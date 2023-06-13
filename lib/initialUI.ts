import LookupComp from "@/components/LookupComp";
import { Edge, Node } from "reactflow";

export const nodeTypes = {
    'lookupComp': LookupComp,
}
export type nodeData = {
    context: string, 
    question: string,
    text: string
}

export const makeNodeConfig = (
    id: string, 
    details: Omit<nodeData, 'text'> = {context: '', question: ''}, 
    position: {x: number, y: number} = { x: 10, y: 10 }
) => {
    return { 
        id, 
        position, 
        data: { ...details, text: '' }, 
        type: 'lookupComp', 
        dragHandle: '.custom-drag-handle' 
    }
}
export const makeEdgeConfig = (from: string, to: string, label: null | string = null) => {
    return { id: `e${from}-${to}`, source: from, target: to, label }
}

export const initialNodes : Node[] = [
    makeNodeConfig('1')
];
export const initialEdges : Edge[] = [];

