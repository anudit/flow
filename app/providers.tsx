// app/providers.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { ReactFlowProvider } from 'reactflow'

export function Providers({ 
    children 
  }: { 
  children: React.ReactNode 
  }) {
  return (
    <CacheProvider>
      <ChakraProvider>
        <ReactFlowProvider>
          {children}
        </ReactFlowProvider>
      </ChakraProvider>
    </CacheProvider>
  )
}