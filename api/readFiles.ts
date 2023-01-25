import fs from 'fs';
import path from 'path';

const readFiles = (dirPath: string) => {
  // Resolve the full directory path
  const dir = path.resolve('./public', dirPath);

  // Get a list of filenames in the directory
  const filenames = fs.readdirSync(dir);

  // Map the filenames to image paths
  const images = filenames.map((name) => path.join('/', dirPath, name));

  return images;
};

export default (req, res) => {
  // Read the directory path from the query parameters
  const dirPath = req.query.path || 'images';

  // Use the readFiles function to get a list of images in the specified directory
  const images = readFiles(dirPath);

  res.statusCode = 200;
  res.json(images);
};