const fs = require('fs');
const path = require('path');

const audioDir = path.join(process.cwd(), 'public', 'audio');
const imageDir = path.join(process.cwd(), 'public', 'images');

function generateSongsArray() {
  try {
    // Check if directories exist
    if (!fs.existsSync(audioDir)) {
      console.error('Audio directory not found. Creating directory...');
      fs.mkdirSync(audioDir, { recursive: true });
    }
    if (!fs.existsSync(imageDir)) {
      console.error('Images directory not found. Creating directory...');
      fs.mkdirSync(imageDir, { recursive: true });
    }

    const audioFiles = fs.readdirSync(audioDir);
    const imageFiles = fs.readdirSync(imageDir);

    if (audioFiles.length === 0) {
      console.error('No audio files found in the audio directory.');
      return;
    }

    const songs = audioFiles
      .filter(file => path.extname(file).toLowerCase() === '.mp3')
      .map((file, index) => {
        const baseName = path.basename(file, '.mp3');
        const title = baseName.split(/(?=[A-Z])/).join(' '); // Convert camelCase to spaces
        const imageName = imageFiles.find(img => path.basename(img, path.extname(img)) === baseName);

        return {
          id: index + 1,
          title: title,
          artist: "Test Artist",
          album: "Test Album",
          duration: "3:00",
          addedTime: new Date().toISOString(),
          image: imageName ? `/images/${imageName}` : '/placeholder.svg?height=40&width=40',
          audioSrc: `/audio/${file}`
        };
      });

    if (songs.length === 0) {
      console.error('No MP3 files found in the audio directory.');
      return;
    }

    const outputContent = `export const songs = ${JSON.stringify(songs, null, 2)};`;
    const outputDir = path.join(process.cwd(), 'src');
    const outputPath = path.join(outputDir, 'songs-data.ts');

    // Create src directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, outputContent);
    console.log(`Generated ${songs.length} song entries in src/songs-data.ts`);
  } catch (error) {
    console.error('Error generating songs array:', error);
  }
}

generateSongsArray();
