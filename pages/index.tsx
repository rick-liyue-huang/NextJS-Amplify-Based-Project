import type { NextPage } from "next";
import Head from "next/head";
// import Image from "next/image";
import styles from "../styles/Home.module.css";
import { allPosts } from ".contentlayer/generated";
import { useEffect, useRef, useState } from "react";
import {
	Box,
	Button,
	Text,
	Textarea,
	Flex,
	Image,
	Input,
	Center,
	Spinner,
} from "@chakra-ui/react";
import { Auth, Predictions, Storage } from "aws-amplify";
import { SignUpForm } from "src/components/signup-form";
import SignOutForm from "src/components/signout-form";
import { SignInForm } from "src/components/signin-form";
import { UploadForm } from "../src/components/upload-form";
import { uploadToS3, getS3Object } from "../src/services/storage";

import Link from "next/link";
import { SearchIcon } from "@chakra-ui/icons";
import { search } from "../src/services/kendra-search";

const ListItem = ({ items }: { items: [] }) => {
	return (
		<div>
			{items.map((item, idx) => (
				<Link href={item["DocumentId"]} passHref key={idx}>
					<a target={"_blank"}>
						<Flex
							direction={"column"}
							// backgroundColor={"green.100"}
							margin={"auto"}
							marginTop={"10px"}
							padding={"10px"}
						>
							<Text>{item["DocumentId"]}</Text>
							<Text
								fontWeight={"bold"}
								color="blue.700"
								_hover={{ textDecoration: "underline" }}
							>
								{item["DocumentTitle"]["Text"]}
							</Text>
							<Text>{item["DocumentURI"]}</Text>
							<Text>{item["DocumentExcerpt"]["Text"]}</Text>
						</Flex>
					</a>
				</Link>
			))}
		</div>
	);
};

const ACTION_KEY_DEFAULT = ["Ctrl", "Control"];
const ACTION_KEY_APPLE = ["⌘", "Command"];

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

	const [items, setItems] = useState<any>([]);
	const [query, setQuery] = useState("");
	const [spinning, setSpinning] = useState(false);
	const eventRef = useRef<"mouse" | "keyboard">(null);

	const callSearch = async (query: string) => {
		if (query) {
			setSpinning(true);
			const result = await search(query);
			setItems(result);
			setSpinning(false);
		}
	};

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
		<Flex direction={"column"} maxW={"1100px"} margin="auto">
			<Flex pos={"relative"} align="stretch" marginTop={"10px"}>
				<Input
					aria-autocomplete="list"
					autoComplete="off"
					autoCorrect="off"
					spellCheck="false"
					maxLength={64}
					sx={{
						w: "100%",
						h: "68px",
						pl: "68px",
						fontWeight: "medium",
						outline: 0,
						bg: "gray.200",
						_focus: { shadow: "outline" },
						rounded: "7px",
						".chakra-ui-dark &": { bg: "gray.700" },
					}}
					placeholder="Search the docs"
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
					}}
					onKeyDown={(e: React.KeyboardEvent) => {
						if (e.key === "Enter") {
							console.log("search for ", query);
							callSearch(query);
						}
					}}
				></Input>
				<Center pos={"absolute"} left={7} h={"68px"}>
					<SearchIcon color={"teal.500"} boxSize={"20px"}></SearchIcon>
				</Center>
				<Center pos={"absolute"} right={7} h={"68px"}>
					<Spinner
						color="green"
						display={spinning ? "block" : "None"}
					></Spinner>
				</Center>
			</Flex>
			{items.length > 0 && <ListItem items={items}></ListItem>}
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

/**
 * <Flex
			margin={"auto"}
			maxWidth={"1000px"}
			direction="column"
			alignItems="center"
		>
			<ViewImage imageUrl={imageUrl!}></ViewImage>
			<UploadForm processFile={uploadToS3} setImages={setImages}></UploadForm>
			<ListImages images={images} setImageUrl={setImageUrl}></ListImages>
		</Flex>
 */
