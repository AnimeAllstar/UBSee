# UBSee client

The front-end of UBSee is made using React. The starter files for the client were generated using [Create React App](https://github.com/facebook/create-react-app).

Directories:

- **`./public/`** contains index.html, images, and other static files
- **`./src/`**:
  - **`./components/`** contains all components
  - **`./contexts/`** contains DataContext, which used useContext to provide graph to all components in **`App.js`**
  - **`./functions/`** contains javascript functions that do not dirrectly update the state of components but are used by componenents throughout the app
  - **`./hooks/`** contains custom hooks

### Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### Note: The front-end depends on data from the REST API, read the [README](../README.md) in the root folder to know how to run both the client and express server concurrently.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
customize it when you are ready for it.

### `npm run analyze`

Uses [Source map explorer](https://www.npmjs.com/package/source-map-explorer) to analyzes JavaScript bundles using the source maps.

To analyze the bundle run the production build then run the analyze script:

`npm run build` \
`npm run analyze`
