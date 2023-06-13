import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

import { initialEdges, initialNodes } from './initialUI';


type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void; 
  addEdge: (node: Edge) => void; 
  appendNodeLabel: (nodeId: string, label: string) => void;
};

export const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
  addEdge: state.addEdge,
  appendNodeLabel: state.appendNodeLabel,
});

const useStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  addNode: (node: Node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },
  addEdge: (edge: Edge) => {
    set((state) => ({
      edges: [...state.edges, edge],
    }));
  },
  appendNodeLabel: (nodeId: string, label: string) => {
    set((state) => {
      const nodes = state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              label: node.data?.label + label,
            },
          };
        }
        return node;
      });

      return {
        nodes: nodes,
      };
    });
  },
}));

export default useStore;
