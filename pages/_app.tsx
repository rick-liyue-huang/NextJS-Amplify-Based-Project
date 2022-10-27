import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import awsconfig from "../src/aws-exports";
import { Amplify, Auth, Predictions } from "aws-amplify";
import { AmazonAIPredictionsProvider } from "@aws-amplify/predictions";

try {
	Amplify.configure(awsconfig);
	Amplify.register(Auth);
	Amplify.register(Predictions);
	Amplify.addPluggable(new AmazonAIPredictionsProvider());
} catch (err) {
	console.log(err);
}

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider>
			<Component {...pageProps} />
		</ChakraProvider>
	);
}

export default MyApp;
