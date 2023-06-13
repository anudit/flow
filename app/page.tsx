"use client"

import LookupComp from '@/components/LookupComp';
import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Panel,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  useReactFlow,
  ReactFlowInstance
} from 'reactflow';

import 'reactflow/dist/style.css';


import { shallow } from 'zustand/shallow';
import useStore, { selector } from '@/lib/store';
import { initialEdges, initialNodes, nodeTypes } from '@/lib/initialUI';

const flowKey = 'local-flow';

export default function App() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setEdges, setNodes } = useStore(selector, shallow);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<any, any>>();
  const [loadLocal, setLoadLocal] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(()=>{
    if (window?.localStorage && loadLocal == false) {
        let localData = localStorage.getItem(flowKey);
        if (localData) {
          const flow = JSON.parse(localData);
          if (flow) {
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
            console.log('Reloaded from Local Storage.')
            setLoadLocal(true)
          }
          else {
            setLoadLocal(true)
          }
        }
        else {
          setLoadLocal(true)
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(()=>{
    if (rfInstance){
      setSaving(true)
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
      console.log('saved');
      setSaving(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onInit={(data)=>{
          setRfInstance(data)
        }}
      >
        <Panel position="top-right">
          {saving === true ? 'Saving...': 'Saved'}
        </Panel>
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Cross} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}