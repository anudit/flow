import { Button, ButtonGroup, Flex, IconButton, Input } from '@chakra-ui/react';
import {CheckCircleIcon, DragHandleIcon} from '@chakra-ui/icons';
import React, { memo, useEffect, useRef } from 'react';
import { Handle, Position, useEdges, useNodeId, useStoreApi } from 'reactflow';
import styled from 'styled-components';
import { createParser } from 'eventsource-parser';

import { shallow } from 'zustand/shallow';
import useStore, { selector } from '@/lib/store';
import { makeEdgeConfig, makeNodeConfig } from '@/lib/initialUI';

const Node = styled.div`
  padding: 10px 20px;
  border-radius: 5px;
  background: ${(props) => props.theme.nodeBg};
  color: ${(props) => props.theme.nodeColor};
  border: 1px solid;
  max-width: 20rem;
  cursor: text;
  > div {
    user-select: text;
  }
  .react-flow__handle {
    background: ${(props) => props.theme.primary};
    width: 8px;
    height: 10px;
    border-radius: 3px;
  }
  ::selection {
    background: #0f0;
  }
`;


const LookupComp = memo(({ data, selected }: {data: {label : string}, selected: any}) => {
  const nodeId = useNodeId();
  const { addNode, addEdge, nodes, appendNodeLabel } = useStore(selector, shallow);
  const selectRef = useRef<HTMLParagraphElement>(null)
  const promptRef = useRef<HTMLInputElement>(null)

  async function handleGpt(selectedText: string, prompt: string, nodeId: string) {

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        prompt: `${prompt}\nContext:${selectedText}`
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.body != null && response.ok === true){
      

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
  
      const parser = createParser((event)=>{
        console.log('event', event);
        if (event.type === 'event') {
          try {
            const data = JSON.parse(event.data);
            data.choices
              .filter(({ delta }: {delta: {content: string}}) => !!delta.content)
              .forEach(({ delta }: {delta: {content: string}}) => {
                
              });
          } catch(e) {
            console.log(e)
          }
        }
      })

      while (true) {
        const { value, done } = await reader.read();
        const dataString = decoder.decode(value);
        if ( done || dataString.includes('[DONE]') ) break;
        if (done === false){
          appendNodeLabel(
            nodeId,
            dataString
          )
        }
        console.log('resp in', dataString, done);
      } 

    }

  }

  return (
    <Node>
      <Handle type="target" position={Position.Left} />
      <Flex w="100%" m="-20px"  position="absolute" flexDir='row-reverse'>
        <ButtonGroup >
          <Button> <CheckCircleIcon onClick={()=>{
            if (nodeId != null && window != null){
              // @ts-expect-error
              const highlighted = window.getSelection().toString();
              const newId = String(nodes.length+1);

              addNode(makeNodeConfig(newId, highlighted, {x:300, y:300}))
              addEdge(makeEdgeConfig(String(nodeId), newId))
              handleGpt(
                highlighted, 
                promptRef.current && promptRef.current?.value.trim() != "" ? promptRef.current.value.trim() : 'Tell me more about this:',
                newId
              )
            }
          }}/></Button>
          <Button className='custom-drag-handle'> <DragHandleIcon/></Button>
        </ButtonGroup>
      </Flex>
      <Flex direction="column">
        <Input ref={promptRef} type="text" placeholder='Prompt ?'/>
        <strong ref={selectRef}>{data.label}</strong>
      </Flex>
      <Handle type="source" position={Position.Right} />
    </Node>
  );
});


LookupComp.displayName = 'LookupComp';

export default LookupComp;