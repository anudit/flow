import { Button, ButtonGroup, Flex, IconButton, Input, InputGroup, InputRightElement, Textarea } from '@chakra-ui/react';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Handle, Position, useNodeId, Node as RfNode } from 'reactflow';
import styled from 'styled-components';

import { shallow } from 'zustand/shallow';
import useStore, { selector } from '@/lib/store';
import { makeEdgeConfig, makeNodeConfig, nodeData } from '@/lib/initialUI';
import { MoveIcon } from './icons';
import ReactMarkdown from 'react-markdown';

const Node = styled.div`
  padding: 10px 20px;
  border-radius: 5px;
  background: ${(props) => props.theme.nodeBg};
  color: ${(props) => props.theme.nodeColor};
  border: 1px solid;
  max-width: 30rem;
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


const LookupComp = memo(({ data, selected }: {data: nodeData, selected: any}) => {
  const nodeId = useNodeId();
  const { addNode, addEdge, nodes, edges, appendNodeLabel, getNodeText } = useStore(selector, shallow);
  const selectRef = useRef<HTMLParagraphElement>(null)
  const promptRef = useRef<HTMLTextAreaElement>(null)
  const [loadingNext, setLoadingNext] = useState<boolean>(false)

  async function handleGpt(context: string, question: string, nodeId: string) {

    setLoadingNext(true);

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        prompt: `${question}\nContext:${context}`
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.body != null && response.ok === true){
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
  
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
      setLoadingNext(false);

    }
    else {
      setLoadingNext(false);
    }
  }

  function processGpt(){
    if (nodeId != null && window != null){
      // @ts-expect-error

      const highlighted =  window.getSelection().toString().trim();
      const complete = getNodeText(nodeId);

      const context = highlighted.length == 0 ? complete === undefined ? '' : complete : highlighted;
      const newId = String(nodes.length+1);
      const question = promptRef.current && promptRef.current?.value.trim() != "" ? promptRef.current.value.trim() : 'Tell me more about this:';

      addNode(makeNodeConfig(newId, {context, question}, {x:300, y:300}))
      addEdge(makeEdgeConfig(String(nodeId), newId, question))
      handleGpt(
        context, 
        question,
        newId
      )
    }
  }

  function getChain(){
    if (nodes.length == 0 ){
      return []
    }
    else if (nodes.length == 1){
      return nodes;
    }
    else {
      if (nodeId){
        
        let inEdge = edges.filter(e=>parseInt(e.target) === parseInt(nodeId))[0];
        let nodeArray: RfNode[] = [
          nodes.filter(e=>e.id == inEdge.source)[0],
          nodes.filter(e=>e.id == inEdge.target)[0]
        ];
  
        while(inEdge.source != '1') {
          inEdge = edges.filter(e=>e.source == inEdge.source)[0]
          nodeArray = nodes.filter(e=>e.id == inEdge.source).concat(nodeArray);
        }
  
        console.log('#node list ',nodeArray);
        return nodeArray;
      }
    }
  }

  return (
    <Node>
      <Handle type="target" position={Position.Left} />
      <Flex w="95%" mt="-35px"  position="absolute" flexDir='row-reverse'>
        <ButtonGroup size="xs" variant='unstyled'>
          {/* <Button onClick={getChain}><MoveIcon/></Button> */}
          <Button className='custom-drag-handle' ><MoveIcon/></Button>
        </ButtonGroup>
      </Flex>
      <Flex direction="column" p={4}>
        {
          data?.context != "" && (
            <>
              <p>Context: {data.context}</p>
              <br/>
            </>
          )
        }
        <ReactMarkdown>
          {data.text || "( ｡_｡)"}
        </ReactMarkdown>
        <InputGroup size='md' mt={2}>
          <Textarea pr='4.5rem' ref={promptRef} placeholder={nodeId === '1' ? 'Ask me something' : 'Refine the thought.'}/>
          <InputRightElement width='4.5rem' right="3px">
            <Button h='1.75rem' size='sm' onClick={processGpt} isLoading={loadingNext}>
              Ask AI
            </Button>
          </InputRightElement>
        </InputGroup>
      </Flex>
      <Handle type="source" position={Position.Right} />
    </Node>
  );
});


LookupComp.displayName = 'LookupComp';

export default LookupComp;