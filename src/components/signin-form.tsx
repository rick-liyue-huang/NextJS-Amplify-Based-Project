import {
	Box,
	VStack,
	Text,
	Input,
	InputGroup,
	InputLeftElement,
	Button,
} from "@chakra-ui/react";
import { EmailIcon, ViewIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { Auth } from "aws-amplify";
// import { signIn } from "../services/cognito";

export const SignInForm = ({ setUser }: { setUser: any }) => {
	const [name, setName] = useState("");
	const [pass, setPass] = useState("");

	const signIn = async (username: string, password: string) => {
		console.log("sign in...", username, password);
		try {
			const user = await Auth.signIn(username, password);
			console.log("user, ", user);
			const authenticated = await Auth.currentAuthenticatedUser();
			console.log("authenticated, ", authenticated);
			setUser(user);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Box
			height="70vh"
			display="flex"
			alignItems="center"
			justifyContent="center"
			margin={"auto"}
		>
			<VStack
				py={12}
				px={12}
				borderWidth={1}
				borderRadius="lg"
				spacing={4}
				alignItems="flex-start"
			>
				<Text fontSize={30}>Welcome</Text>
				<InputGroup>
					<InputLeftElement>{<EmailIcon></EmailIcon>}</InputLeftElement>
					<Input
						placeholder="Email"
						value={name}
						onChange={(event) => {
							setName(event.target.value);
						}}
					></Input>
				</InputGroup>
				<InputGroup>
					<InputLeftElement>{<ViewIcon></ViewIcon>}</InputLeftElement>
					<Input
						placeholder="Password"
						value={pass}
						onChange={(event) => {
							setPass(event.target.value);
						}}
					></Input>
				</InputGroup>
				<Button
					width="100%"
					colorScheme="teal"
					onClick={async () => {
						const user = await signIn(name, pass);
						setUser(user);
					}}
				>
					Sign In
				</Button>
				<Button
					width="100%"
					colorScheme="orange"
					onClick={async () => {
						setUser("SIGNUP");
					}}
				>
					Create An Account
				</Button>
			</VStack>
		</Box>
	);
};
