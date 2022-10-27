import { Box, VStack, Button } from "@chakra-ui/react";
import { Auth } from "aws-amplify";

const SignOutForm = ({ setUser }: { setUser: any }) => {
	const signOutButton = async () => {
		const resp = await Auth.signOut();
		console.log(resp);
		setUser(resp);
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
				<Button
					width="100%"
					colorScheme="teal"
					onClick={async () => {
						signOutButton();
					}}
				>
					Sign Out
				</Button>
			</VStack>
		</Box>
	);
};

export default SignOutForm;
