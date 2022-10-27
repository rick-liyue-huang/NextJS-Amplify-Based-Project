import type { NextPage } from "next";
import Head from "next/head";
// import Image from "next/image";
import styles from "../styles/Home.module.css";
import { allPosts } from ".contentlayer/generated";
import { useEffect, useState } from "react";
import { Box, Button, Text, Textarea, Flex, Image } from "@chakra-ui/react";
import { Auth, Predictions, Storage } from "aws-amplify";
import { SignUpForm } from "src/components/signup-form";
import SignOutForm from "src/components/signout-form";
import { SignInForm } from "src/components/signin-form";
import { UploadForm } from "../src/components/upload-form";
import { uploadToS3, getS3Object } from "../src/services/storage";

const PostCard = ({ post }: { post: any }) => {
	return (
		<a href={post.url} className={styles.card}>
			<h2>{post.title} &rarr;</h2>
			<p>{post.description}</p>
		</a>
	);
};

const ListImages = ({
	images,
	setImageUrl,
}: {
	images: string[];
	setImageUrl: any;
}) => {
	return (
		<Flex
			direction={"column"}
			width={"100%"}
			height={"300px"}
			overflowY={"auto"}
			marginTop={"20px"}
		>
			{images.map((image, id) => (
				<Flex
					key={id}
					width={"100%"}
					justifyContent={"space-between"}
					padding={"5px"}
					backgroundColor={"gray.100"}
					marginBottom={"5px"}
				>
					<Text>{image}</Text>
					<Button
						colorScheme={"teal"}
						onClick={async () => {
							const url = await getS3Object(image);
							setImageUrl(url);
						}}
					>
						View
					</Button>
				</Flex>
			))}
		</Flex>
	);
};

const ViewImage = ({ imageUrl }: { imageUrl: string }) => {
	return (
		<Box
			bg={"gray.100"}
			width={"1000px"}
			height={"500px"}
			padding={"20px"}
			display={"flex"}
			justifyContent={"center"}
			alignItems={"center"}
			marginBottom={"20px"}
		>
			{imageUrl && <Image src={imageUrl} width="auto" height={"350px"}></Image>}
		</Box>
	);
};

const Home: NextPage = () => {
	const [text, setText] = useState("hello");

	const [imageUrl, setImageUrl] = useState<string>();
	const [images, setImages] = useState<string[]>([]);

	const listImages = async () => {
		Storage.list("").then((result) => {
			const keys = result.map((item) => item.key);
			// @ts-ignore
			setImages(keys);
		});
	};

	useEffect(() => {
		listImages();
	}, []);

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

	return (
		<Flex
			margin={"auto"}
			maxWidth={"1000px"}
			direction="column"
			alignItems="center"
		>
			<ViewImage imageUrl={imageUrl!}></ViewImage>
			<UploadForm processFile={uploadToS3} setImages={setImages}></UploadForm>
			<ListImages images={images} setImageUrl={setImageUrl}></ListImages>
		</Flex>
	);
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

/**
		 * if (user === "SIGNUP") {
		return <SignUpForm setUser={setUser} />;
	}

	if (typeof user === "object") {
		return <SignOutForm setUser={setUser} />;
	}

	return <SignInForm setUser={setUser} />;
		 */
