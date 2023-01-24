# Location-Finder
Using React and Typescript, build a single-page web application where the user can search locations and get population information.

**Live Project Link** https://gavindmello97.github.io/Location-Finder/#/

## Features
Set of features/user flows in this project. All features are build to fullfill every case from the user stories, 

### **User Stories**
- As a user, I can search for locations using an input field and view a list of results that is filtered to show only administrative boundaries (hint: type should be “administrative”).
- As a user, I can view an interactive map that defaults to Boston, MA on page load.
- As a user, I can select a search result and view the location on the map with the boundaries of the polygon visible.
- As a user, when I click on a search result, I can view the location’s population and the year the population data.
- As a user, I can share my findings with someone else with a share button that copies the link to clipboard.
- As a user, I can visit the link of the app shared to me by my friend and I should see the same search query, results, and selected result on the page.
- As a user, I can view my recent searches and clicking on one should return me to that search.

### **Additional Features**
- Custom Tooltip/Popover to notify and acknoledge "Share" & "copy to clip-board".
- Map pinch and zoom along with Polygon Popup within boundaries of the selected location.
- Modal for sharing link of current search with other users and providing clear instructions of copy pasting in the modal.

## Steps to run the project
1.  Download the project from github(fork, zip download, etc.) and save it at a location you intend to place it.
2.  Open Terminal of editor(or VSCode Terminal) or System Terminal and redirect to the project folder.
3.  Install node modules and clear builds
<pre>
npm install --save
rm -rf  build
</pre>
4. Run the project(locally) using: 
<pre>npm start</pre>
5. Secondly, if you want to create a build or create a build and run:
<pre>npm run predeploy
npm run deploy </pre>

       
## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
