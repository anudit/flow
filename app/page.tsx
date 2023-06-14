"use client"

import React, { useEffect, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  ReactFlowInstance
} from 'reactflow';

import 'reactflow/dist/style.css';
import '../styles/global.css';

import { shallow } from 'zustand/shallow';
import useStore, { selector } from '@/lib/store';
import { nodeTypes } from '@/lib/initialUI';
import { Flex, Heading, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { AddIcon, HamburgerIcon } from '@chakra-ui/icons';
import { EraserIcon, SaveIcon } from '@/components/icons';
import saveFile from '@/lib/saveFile';

const flowKey = 'local-flow';

export default function App() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setEdges, setNodes, reset } = useStore(selector, shallow);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<any, any>>();
  const [loadLocal, setLoadLocal] = useState<boolean>(false);

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
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance, nodes, edges])

  async function exportBackup() {
    if (rfInstance){
      const flow = rfInstance.toObject();
      saveFile(JSON.stringify(flow), `flow-set.flow`, 'application/json')
      
    }
  }

  return (
    <Flex width='100vw' height='100vh' direction='column'>
      <Flex w="100%" align="center" alignItems='center' borderBottomColor='#000' borderBottomWidth="1px">
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<HamburgerIcon />}
            variant='unstyled'
          />
          <MenuList>
            <MenuItem icon={<EraserIcon />} onClick={reset}>
              Clear Board
            </MenuItem>
            <MenuItem icon={<SaveIcon />} onClick={exportBackup}>
              Save Locally 
            </MenuItem>
          </MenuList>
        </Menu>
        <Heading fontSize='sm'>
          Flow
        </Heading>
      </Flex>
      <Flex w="100%" h="100%">
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
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Cross} gap={12} size={1} />
        </ReactFlow>
      </Flex>
    </Flex>
  );
}