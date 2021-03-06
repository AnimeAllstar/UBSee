<p align="center"><img src="https://user-images.githubusercontent.com/39626451/124312404-ddeaf780-db8c-11eb-950e-3ec28175f7b7.png" alt="UBSee icon" height="60" /></p>

<h1 align="center">UBSee</h1>
<p align="center">Creates interactive graphs for <a href="https://www.ubc.ca/" target="_blank">UBC</a> subjects and courses 📖</p>

UBSee is a full stack single page application made using the MERN stack. The client is made using React and the server is an express REST API that provides graph data stored in a MongoDB Atlas cluster.

Live at : [ubsee.dev](https://www.ubsee.dev/) | deployed using [heroku](https://heroku.com)

Make sure to share the website with other students if it helped you out. ⌚ or ⭐ the project to keep up with latest changes.

## Sample graphs

<div align="center">
  <img src="https://user-images.githubusercontent.com/39626451/124315395-80a57500-db91-11eb-9629-0b646951a72a.jpg" alt="img1" width="400"/>
  <img src="https://user-images.githubusercontent.com/39626451/124314711-6d45da00-db90-11eb-8180-4cea33fad682.jpg" alt="img2" width="400"/>
</div>

## How to install

- install [Node](https://nodejs.org) `>=16.13.1`.
- run `npm install` to install server dependancies
- `cd client` and run `npm install` to install client dependancies

## Available Scripts

- `npm start` - runs the REST API at [localhost:8080](http://localhost:8080/).
- `npm run dev` - concurrently runs client and server. **Use this for local development**.
- `npm run nodemon` - runs the REST API at [localhost:8080](http://localhost:8080/) using [nodemon](https://www.npmjs.com/package/nodemon).
- `npm run client` - runs client from the root directory.

Check package.json to see all scripts

## How to contribute

Create an issue or submit a pull request. **Any improvement/feedback about the project is valuable.**

### Adding new subjects

Added a new subject is not too challenging (it's just monotonous) since we have written multiple simple scripts to aid in doing so at `./scripts/`

There are a few steps in adding a new subject:

- run `npm run add [SUBJECT ID]` to add a base json file with an empty _prereqs_ fields
- add the prerequisite expressions for each course in the json **manually**
- rename the file to [SUBJECT ID].json
- run `npm run test [SUBJECT ID]` to test your json. Read comments in the script file to understand what the tests do
- run `npm run fix [SUBJECT ID] [COURSE #]` for each course to add missing courses in the JSON
  - if the course is still not found, then remove the course from the prereq expression (since the data is unavailable)
- add [SUBJECT ID].json to course.json
- run the server and click all nodes to make sure that an error is not thrown
- make a pull request making sure you describe any important details

Make sure you read and understand what the scripts do. Unfortunately, because UBC doesn't officially provide the data, courses and subject need to be manually added for now.

Make sure to submit a pull request if you think you can improve the process of adding new subjects.

### From JSON to MongoDB

Use `npm run json-mongo` to add data from `./data/json/courses.json` to MongoDB. Add your `MONGI_URI` in a .env file.
Uncomment the lines at the bottom of `./scripts/json-mongo.js` before running the command and take a look at the file for more information.

## Contributors

- [Asad Dhorajiwala](https://github.com/AnimeAllstar)
- [Rithin Kumar RS](https://github.com/L0Lmaker)

## Technologies

- NodeJs
- Express (web server for REST API)
- ReactJs (used to create static client)
- MongoDB (datababse)
- GoJS (Graphing library)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Credits

- UBSee icon made by [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com/)</div>
- Use of GoJS made under their [Academic Use](https://www.nwoods.com/sales/academic-use.html) policy
- Course data provided by [ubcexplorer](https://ubcexplorer.io/api) and [ubccourses](https://github.com/StuffByLiang/realtime-ubc-courses-api)
