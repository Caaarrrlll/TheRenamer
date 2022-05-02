const fse = require("fs-extra");

document.ondragover = (ev) => {
	ev.preventDefault();
};

document.ondrop = (ev) => {
	ev.preventDefault();
	basicRename(ev.dataTransfer.files);
};

// const Matcher = {
// 	sddedd: "sddedd",
// 	dxdd: "dxdd",
// 	dd: "dd",
// };

// const Matchers = {
// 	[Matcher.sddedd]: /s\d+(-?e\d+){1,}/gi,
// 	[Matcher.dxdd]: /\d+x\d+/gi,
// 	[Matcher.dd]: /-\s\d+/gi,
// };

basicRename = (files) => {
	if (files.length == 0) return;

	Object.keys(files).map((file) => {
		const newFile = getRenamedFile(files[file]);
		fse.rename(files[file].path, newFile);
	});
};

getRenamedFile = (file) => {
	const extension = file.name.split(".").pop();
	const basePath = file.path.replace(file.name, "");

	/* @TODO: Make this more generic to cater for more types of series naming */
	const startIndex = file.name.toLowerCase().search(/s\d+e\d+/);

	const seasonInfo = file.name
		.substring(startIndex, file.name.length)
		.split(".")
		.shift();

	const seriesName = file.name
		.split(seasonInfo)
		.shift()
		.slice(0, -1)
		.split(".")
		.map((word) => {
			return word[0].toUpperCase() + word.substring(1);
		})
		.join(" ");

	return `${basePath}${seriesName}.${seasonInfo}.${extension}`;
};
