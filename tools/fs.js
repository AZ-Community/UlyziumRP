const fs = require("fs");

/**
 * Function checks if the file exist
 * @param name : file name
 * @return true if the file has been found
 */
function isFileExist( name, type ){
	return fs.existsSync(`./${name}.${type}`);
};

/**
 * Function returns instance of class with specific name
 * @param name : file name
 * @return instance 
 */
function getInstanceOfClass( name ) {
	return require(`../mobs/${name}.js`);
};

function readJSON( path ) {
	return require(`../${path}.json`);
};

module.exports.isFileExist = isFileExist;
module.exports.getInstanceOfClass = getInstanceOfClass;
module.exports.readJSON = readJSON;