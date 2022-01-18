import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { theme } from "../theme";
import { AuthProvider } from "../context/Auth/Auth";
import { Web3UtilityProvider } from "../context/Web3/Web3";

import { StepsStyleConfig as Steps } from 'chakra-ui-steps';

const theme2 = extendTheme({
  ...theme,
  components: {
    Steps,
  },
});

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ChakraProvider theme={theme2}>
      <AuthProvider>
        <Web3UtilityProvider>
          <Component {...pageProps} />
        </Web3UtilityProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}
export default MyApp;
