const cloudinary = require("cloudinary").v2;

const imageUpload = async (file) => {
	const result = await cloudinary.uploader.upload(file, {
		folder: "yang-form",
	});
	console.log(result);
	return result.url;
};

module.exports = {
	imageUpload,
};
