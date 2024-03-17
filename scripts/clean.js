import fs from "fs";
import path from "path";

// Get arguments from the command line
const folderPath = path.normalize(process.argv[2]);
const deleteList = process.argv.slice(3);

const foundDirs = [];
const foundFiles = [];

function searchAll(directory, deleteList) {
  try {
    const items = fs.readdirSync(directory);
    items.forEach((item) => {
      const itemPath = path.join(directory, item);
      const isDir = fs.statSync(itemPath).isDirectory();
      if (deleteList.some((pattern) => new RegExp(pattern).test(item))) {
        if (isDir) {
          foundDirs.push(itemPath);
        } else {
          foundFiles.push(itemPath);
        }
      } else {
        if (isDir) {
          searchAll(itemPath, deleteList);
        }
      }
    });
  } catch (err) {
    console.error(`Error searching: ${directory}`, err);
  }
}

searchAll(folderPath, deleteList);

[foundDirs, foundFiles].flat().forEach((item) => {
  fs.rmSync(item, { recursive: true, force: true });
  console.log(`Deleted: ${item}`);
});
