"use client"

import LookupComp from '@/components/LookupComp';
import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  
} from 'reactflow';

import 'reactflow/dist/style.css';


import { shallow } from 'zustand/shallow';
import useStore, { selector } from '@/lib/store';
import { initialEdges, initialNodes, nodeTypes } from '@/lib/initialUI';


export default function App() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(selector, shallow);

  // async function GptIt(nodeId, text){
  //   setNodes()
  //   addEdge
  // }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        // onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Cross} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}