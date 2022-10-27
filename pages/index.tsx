import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { allPosts } from ".contentlayer/generated";
import { useState } from "react";
import { Box, Button, Text, Textarea } from "@chakra-ui/react";
import { Auth, Predictions } from "aws-amplify";
import { SignUpForm } from "src/components/signup-form";
import SignOutForm from "src/components/signout-form";
import { SignInForm } from "src/components/signin-form";

const PostCard = ({ post }: { post: any }) => {
	return (
		<a href={post.url} className={styles.card}>
			<h2>{post.title} &rarr;</h2>
			<p>{post.description}</p>
		</a>
	);
};

const Home: NextPage = () => {
	const [text, setText] = useState("hello");

	const handleConvert = () => {
		// amplify text to speech
		Predictions.convert({
			textToSpeech: {
				source: {
					text: text,
				},
				voiceId: "Kimberly",
			},
		}).then((result) => {
			const audioCtx = new AudioContext();
			const source = audioCtx.createBufferSource();
			audioCtx.decodeAudioData(
				result.audioStream,
				(buffer) => {
					source.buffer = buffer;
					source.connect(audioCtx.destination);
					source.start(0);
				},
				(error) => {
					console.log(error);
				}
			);
		});
	};

	const [user, setUser] = useState<any>(null);

	const getAuthUser = async () => {
		try {
			const currentUser = await Auth.currentAuthenticatedUser();
			setUser(currentUser);
			console.log(currentUser);
		} catch (err) {
			console.log("err get user auth ,", err);
		}
	};

	if (user === "SIGNUP") {
		return <SignUpForm setUser={setUser} />;
	}

	if (typeof user === "object") {
		return <SignOutForm setUser={setUser} />;
	}

	return <SignInForm setUser={setUser} />;
};

export default Home;

/**
 * <Box maxW={"1000px"} margin="auto" marginTop={"100px"}>
			<Textarea
				placeholder={text}
				overflowY="auto"
				height={"300px"}
				value={text}
				marginBottom="100px"
				backgroundColor={"gray.100"}
				onChange={(e) => setText(e.target.value)}
			></Textarea>
			<Button colorScheme={"blue"} onClick={handleConvert}>
				Text To Speech
			</Button>
		</Box>
 */
