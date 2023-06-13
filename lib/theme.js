import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    // styles: {
    //     global: (props) => ({
    //       "html, body": {
    //         background: props.colorMode === "dark" ? "#000" : "white",
    //       },
    //     }),
    // },
    fontWeights: {
      normal: 200,
      medium: 500,
      bold: 900
    },
    config: {
      cssVarPrefix: "fl",
      initialColorMode: "light",
      useSystemColorMode: false
    },
    components: {
      Menu: {
        baseStyle: (props) => ({
          list: {
            bg: props.colorMode === "dark" ? "#111111db" : "white",
            backdropFilter: "blur(24px)",
            border: 'none'
          },
          item: {
            bg: props.colorMode === 'dark' ? 'hsl(0deg 0% 12% / 12%)' : "hsl(0deg 0% 12.01% / 0%)",
            _hover: {
              bg: props.colorMode === 'dark' ? 'hsl(0deg 0% 12%)' : "hsl(0deg 0% 12% / 9%)",
            },
            _focus: {
              bg: props.colorMode === 'dark' ? 'hsl(0deg 0% 12%)' : "hsl(0deg 0% 12% / 9%)",
            },
          },
        }),
      },
      Modal: {
        baseStyle: (props) => ({
          dialog: {
            bg: props.colorMode === "dark" ? "#111111db" : "white",
            backdropFilter: "blur(24px)"
          },
        }),
      },
      Drawer: {
        baseStyle: (props) => ({
          dialog: {
            bg: props.colorMode === "dark" ? "#111111db" : "white",
            backdropFilter: "blur(24px)"
          },
        }),
      },
    }
})

export default theme;
