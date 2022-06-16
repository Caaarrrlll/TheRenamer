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

getRenamedFile = async (file) => {
	const extension = file.name.split(".").pop();
	const basePath = file.path.replace(file.name, "");

	/* 
		TODO: Make this more generic to cater for more types of series naming 
	*/
	const startIndex = file.name.toLowerCase().search(/s\d+e\d+/);

	// @TODO: Clean file name before processing
	const preppedName = file.name.replace(/\s-\s/g, ".");

	const seasonInfo = file.name
		.substring(startIndex, file.name.length)
		.split(".")
		.shift()
		.split(" ")
		.shift();

	const seriesName = preppedName
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
	const windowsFriendlyEpisodeName = episodeDetails.data.name
		.replace(/\?|<|>|:|\*|\\|\/|\|/g, "")
		.replace(/"/g, "'");

	return `${basePath}${seriesName}.${cleanedSeasonInfo}.${windowsFriendlyEpisodeName}.${extension}`;
};
