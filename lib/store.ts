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
  setNodes: (node: Node[]) => void; 
  setEdges: (node: Edge[]) => void; 
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void; 
  addEdge: (node: Edge) => void; 
  appendNodeLabel: (nodeId: string, label: string) => void;
  getNodeText: (nodeId: string) => string | undefined;
  setNodeText: (nodeId: string, text: string) => void;
  reset: () => void;
};

export const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
  addEdge: state.addEdge,
  appendNodeLabel: state.appendNodeLabel,
  getNodeText: state.getNodeText,
  setNodeText: state.setNodeText,
  reset: state.reset,
});

const useStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  setNodes: (nodes : Node[]) => {
    set({ nodes: nodes });
  },
  setEdges: (edges : Edge[]) => {
    set({ edges: edges });
  },
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
  appendNodeLabel: (nodeId: string, text: string) => {
    set((state) => {
      const nodes = state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              text: node.data?.text + text,
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
  setNodeText: (nodeId: string, text: string) => {
    set((state) => {
      const nodes = state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              text,
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
  getNodeText: (nodeId: string) => {
    const node = get().nodes.find((node) => node.id === nodeId);
    return node?.data?.text;
  },
  reset: () => {
    set((state) => ({
      edges: initialEdges,
      nodes: initialNodes,
    }));
  }
}));

export default useStore;
