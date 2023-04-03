import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // http://localhost:8082/filteredimage endpoint
  app.get( "/filteredimage/", async (req: express.Request, res: express.Response)=>{
    
    // Check validation image_url
    const image_url = req.query.image_url;
    let valid = (image_url?.length !== 0);
    if(!valid) {
      return res.status(400).send("The image_url parameter is required.");
    }

    // Receive image_url parameter and then get & process image by FilterImageFromURL service
    await filterImageFromURL(<string>image_url)
      .then(imagePath => {

        // Image is processed successful
        return res.status(200).sendFile(imagePath, error => {
          if (!error) {
            
            // Delete images file on locally
            deleteLocalFiles([imagePath]);
          }
        });
      }).catch(() => {

        // Cannot process image on FilterImageFromURL service
        return res.status(422).send("Processing image got error.");
      });
  });
    
  // Root Endpoint
  app.get( "/", async ( _req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
   
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();