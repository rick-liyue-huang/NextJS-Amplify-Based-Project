import axios from "axios";
import { config } from "../../config";

export const search = async (query: string) => {
	const { data, status } = await axios.get<any>(
		`${config.kendra_url}/query?query=${query}`
	);

	if (status === 200) {
		console.log(data["ResultItems"]);
		return data["ResultItems"];
	} else {
		console.log("error", status);
		return [];
	}
};
