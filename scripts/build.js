const fs = require ( 'fs' )
const path = require ( 'path' )
const cp = require ( 'child_process' )

// fs.readdirSync ( path.join ( __dirname, '../Plugins' ) ).forEach ( pluginName => {
//     cp.exec ( `parcel ${ pluginName }/index.* --dist-dir dist/${ pluginName }` )
//     console.log ( pluginName )
// } )

cp.exec(`parcel ${ "Accordion" }/index.* --dist-dir dist/${ "Accordion" }`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
