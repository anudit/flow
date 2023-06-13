// app/providers.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { ReactFlowProvider } from 'reactflow'
import theme from '../lib/theme';

export function Providers({ 
    children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme} resetCSS>
        <ReactFlowProvider>
          {children}
        </ReactFlowProvider>
      </ChakraProvider>
    </CacheProvider>
  )
}