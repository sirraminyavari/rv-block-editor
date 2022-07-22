import replace from 'replace-in-file';
const options = {
  files: 'dist/*/**',
  from: /\.scss/g,
  to: '.css',
};
try {
  const results = await replace(options);
  console.log('Replacement results:', results);
} catch (error) {
  console.error('Error occurred:', error);
}
