const tvMazeBaseUrl = "https://api.tvmaze.com";

const fse = require("fs-extra");
const axios = require("axios").default;

document.ondragover = (ev) => {
	ev.preventDefault();
};

document.ondrop = (ev) => {
	ev.preventDefault();
	basicRename(ev.dataTransfer.files);
};

basicRename = (files) => {
	if (files.length == 0) return;

	Object.keys(files).map(async (file) => {
		const newFile = await getRenamedFile(files[file]);
		fse.rename(files[file].path, newFile);
	});
};

cleanStringForWindows = (str) => {
	return str.replace(/\?|<|>|:|\*|\\|\/|\|/g, "").replace(/"/g, "'");
};

getRenamedFile = async (file) => {
	const customName = document.getElementById("custom-name").value;
	const extension = file.name.split(".").pop();
	const basePath = file.path.replace(file.name, "");
	const preppedName = file.name
		.replace(/\s-\s/g, ".")
		.replace(/\s\[[A-Za-z0-9]+\]\s/g, "");

	// Matches something [Series Name s01e01 Bla]
	const startIndexDDeDD = file.name.toLowerCase().search(/s\d+e\d+/);
	if (startIndexDDeDD > 0) {
		const seasonInfo = file.name
			.substring(startIndexDDeDD, file.name.length)
			.split(".")
			.shift()
			.split(" ")
			.shift();

		let seriesName =
			customName.length > 0
				? customName
				: preppedName
						.split(seasonInfo)
						.shift()
						.slice(0, -1)
						.split(".")
						.map((word) => {
							return word[0].toUpperCase() + word.substring(1);
						})
						.join(" ")
						.split(seasonInfo)[0]
						.replace(/([0-9]{4})|(\[[A-Za-z]{1,}\])/, "")
						.replace(/\s-/, "")
						.trim();

		const seriesDetails = await axios
			.get(`${tvMazeBaseUrl}/singlesearch/shows?q=${seriesName}`)
			.then((res) => {
				return res;
			});

		const seasonNumber = seasonInfo
			.toUpperCase()
			.split("E")[0]
			.split("")
			.slice(1, seasonInfo.length - 2)
			.join("");

		const episodeNumber = seasonInfo
			.toUpperCase()
			.split("E")[1]
			.split("V")
			.shift();

		const episodeDetails = await axios
			.get(
				`${tvMazeBaseUrl}/shows/${seriesDetails.data.id}/episodebynumber?season=${seasonNumber}&number=${episodeNumber}`
			)
			.then((res) => {
				return res;
			});

		const cleanedSeasonInfo = `S${seasonNumber}E${episodeNumber}`;
		const windowsFriendlyEpisodeName = cleanStringForWindows(
			episodeDetails.data.name
		);

		seriesName = cleanStringForWindows(seriesName);

		const fullRename = `${basePath}${seriesName}.${cleanedSeasonInfo}.${windowsFriendlyEpisodeName}.${extension}`;
		return fullRename;
	}

	// Matches: Some Series Name 01x01
	const startIndexDDxDD = file.name.toLowerCase().search(/\d+x\d+/);
	if (startIndexDDxDD > 0) {
		let seriesName =
			customName.length > 0
				? customName
				: file.name
						.substring(0, startIndexDDxDD)
						.replace(/-/g, "")
						.replace(/"/g, "'")
						.trim();

		const seasonInfo = file.name
			.substring(startIndexDDxDD, file.name.length)
			.split(" ")[0];

		const seriesDetails = await axios
			.get(`${tvMazeBaseUrl}/singlesearch/shows?q=${seriesName}`)
			.then((res) => {
				return res;
			});

		const seasonNumber = seasonInfo
			.toUpperCase()
			.split("X")[0]
			.split("")
			.join("");

		const episodeNumber = seasonInfo
			.toUpperCase()
			.split("X")[1]
			.split("V")
			.shift();

		const episodeDetails = await axios
			.get(
				`${tvMazeBaseUrl}/shows/${seriesDetails.data.id}/episodebynumber?season=${seasonNumber}&number=${episodeNumber}`
			)
			.then((res) => {
				return res;
			});

		const cleanedSeasonInfo = `S${seasonNumber}E${episodeNumber}`;
		const windowsFriendlyEpisodeName = cleanStringForWindows(
			episodeDetails.data.name
		);

		seriesName = cleanStringForWindows(seriesName);

		const fullRename = `${basePath}${seriesName}.${cleanedSeasonInfo}.${windowsFriendlyEpisodeName}.${extension}`;
		return fullRename;
	}

	// Matches: Some Series Name - 01
	const startIndexDigitsOnly = file.name.toLowerCase().search(/\d+/);
	if (startIndexDigitsOnly > 0) {
		let seriesName =
			customName.length > 0
				? customName
				: file.name
						.substring(0, startIndexDigitsOnly)
						.replace(/-/g, "")
						.replace(/"/g, "'")
						.trim();

		const episodeNumber = file.name
			.substring(startIndexDigitsOnly, file.name.length)
			.split(" ")[0];

		const seriesDetails = await axios
			.get(`${tvMazeBaseUrl}/singlesearch/shows?q=${seriesName}`)
			.then((res) => {
				return res;
			});

		const episodeDetails = await axios
			.get(
				`${tvMazeBaseUrl}/shows/${seriesDetails.data.id}/episodebynumber?season=1&number=${episodeNumber}`
			)
			.then((res) => {
				return res;
			});

		const cleanedSeasonInfo = `S01E${episodeNumber}`;
		const windowsFriendlyEpisodeName = cleanStringForWindows(
			episodeDetails.data.name
		);

		seriesName = cleanStringForWindows(seriesName);

		const fullRename = `${basePath}${seriesName}.${cleanedSeasonInfo}.${windowsFriendlyEpisodeName}.${extension}`;
		return fullRename;
	}

	// Basic, only caters for 1 OVA
	const ovaStartIndex = file.name.toLowerCase().search(/OVA|ova/);
	if (ovaStartIndex > 0) {
		let seriesName =
			customName.length > 0
				? customName
				: file.name
						.substring(0, ovaStartIndex)
						.replace(/-/g, "")
						.replace(/"/g, "'")
						.trim();

		const seriesDetails = await axios
			.get(`${tvMazeBaseUrl}/singlesearch/shows?q=${seriesName}`)
			.then((res) => {
				return res;
			});

		let episodeDetails = await axios
			.get(
				`${tvMazeBaseUrl}/shows/${seriesDetails.data.id}/episodes?specials=1`
			)
			.then((res) => {
				return res;
			});

		episodeDetails = episodeDetails.data.filter((filteredElement) => {
			return filteredElement.type.includes("special");
		});

		const windowsFriendlyEpisodeName = cleanStringForWindows(
			episodeDetails.data.name
		);

		const fullRename = `${basePath}${seriesName}.${cleanedSeasonInfo}.${windowsFriendlyEpisodeName}.${extension}`;
		return fullRename;
	}

	return file.path;
};
