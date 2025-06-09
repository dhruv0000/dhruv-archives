---
title: "React"
date: 2025-06-09T12:14:44-04:00
_build:
  list: local
  render: link
---

# React

## Tech Stack
- Vite: Server + bundler; updates apps without refresh, thanks to Hot Module Replacement (HMR).
- Next JS: Custom Router + Bundler + server side/client side rendering (configure options like TypeScript, ESLint, and Tailwind CSS)
- Create React App: Boilerplate react app
- Cargo-React: A Boilerplate for creating Component Libraries in React + Typescript + StoryBook + Styled Components
- Flow: Type Checker

- styled-components: Create react components with css (can pass prop too). Then can wrap in component.
- React Forms Hook: Use `{register, handleSubmit, reset} = useForms()`

- NodeJS: Run the server
- Express: Backend Server (`app.get()` and `app.listen()`)
- nodemon: Automatically restarts your server when file changes are detected
- MongoDB: Non-relational DB, open-source (`mongod` to connect; `mongo` cli to interact)
    - How to connect? `MongoClient` -> `await client.connect()` -> `db = client.db('name')`
- Axios: Automatically allow requests to the back-end when users interact with the UI

- Semantic UI: UI library
- Nodemailer: Email client to send email; nodeJS based

- Firebase Auth 
    - Firebase FrontEnd:
    - `signInWithEmailAndPassword(getAuth(), email, pass)`
    - `SingOut(getAuth())` and
    - Send to new page using props.history
    - `onAuthStateChanged(getAuth(), user => ())` in a `useEffect` (in parent component)
    - Can use token from `await user.getIdToken()` 
    - Firebase Backend:
    - `firebase-admin` `admin`
    - Make a express middleware using `app.use()` and check authToken

- Firebase: Using `firebase-tools`
    - `Data Storage`
        - Doc based, no rows (so doc collection, not tables)
        - Set rules to allow read/write
        - `.firebaserc` Project details; `firebase.json` rules and indexes; `firestore.rules` Data rules
        - Set: `docRef = firstore.doc(/users/{user.id})` `docRef.set()`
        - Retrieve: `firestore.collection(users).doc(user.id)`. Use `.get()` or `.onSnapshot()` for realtime
    - `File Storage`
        - `storge.rules`
        - `useRef` for get the file upload details
        - `fileRef = storage.ref().child(filepath)` `fileRef.put()`
        - Use uploadTask.on(STAGE_CHANGED, next, err, complete) `ref = uploadTask.snapshot.ref`
        - link: `ref.getDownloadUrl()`
    - `Claim Based Auth`
        - Firebase auth is based on JWT
        - Create role-based access
        - `admin = require(firebase-admin)` -> `admin.initializeApp(credentials, databaseURL)`
        - Use cred of service account you want to give access
        - `admin.auth().setCustomUserClaims()`
        - Then in storage rules update access for `request.auth.token.admin == True`
    - `Serverless Fun`
        - `firebase init functions` creates a functions folder containing your Cloud Functions code, a package.json file for dependencies, and an index.js file as the main source file.
        - `firebase functions:set:config a={} ..` to set config
        - Get then using `'firebase-functions'.config().a`
        - Trigger: `functions.auth.user().onCreate({} => {})`
        - Update cloud: `firebase deploy --only functions`
    - `Hosting`
        - Update `firebase.json` with hosting info (public path etc.)
        - Do `firebase deploy --only hosting`

- JWT Auth
    - 3F `Knowledge`, `Ownership`, `Biological`
    - JSON Web Tokens (JWTs) `jwt.sign`
    - a header (type and signing algorithm), a payload (user information), and a signature (proves authenticity)
    - Can be stored in `localStorage` in frontend

- Email Verify
    - Sendgrid to send email, use uuid for each request (saved in db entry of that user). 

- OAuth 2
    - generating a special URL, redirecting the user to the service provider's site, obtaining a code, and using that code to access user information
    - Need to set `Allowed Callback URLs`, `Allowed Origin`, `Allowed Logout`
    - OAuth client will generate link -> useEffect to get in login page
    - Callback link will get info (may need to call service again)
    - Call to login with token in url -> useProp to get token and redirect to home if present

- AuthO
    - Wrapper for Root App `<Auth0Provider clientId domain redirect_url onRedirectCallback>`
    - `{isAuth, loginWithRedirect, logout} = useAuth0` hook to use in login component 

- Amazon Cognito
    - handles tasks like storing passwords, logging in, signing up, email verification, and password resetting
    - user pools to manage user accounts and identity pools to manage permissions
    - Cognito sends a six-digit code for verification and password resets, which the user enters in the application

- React for Accessibility:
    - Semantic HTML: Tags with meaning (not div, span)
    - React Semantic tags: `React.Fragment` insted of div.
    - Focus on Components after update: Create and attach ref, focus on `componentDidUpdate`
    - Skip navigation tab by a `skip nav` button to id of important components
    - Use `onFoucs` and `onBlur` to show hide/options
    - For testing, use `keyboard` or `accessibility audits in Chrome DevTools by selecting Lighthouse` or `screenReaders` like VoiceOver and NVDA

- SSR in React
    - Build using `next build`
    - Redux can help with performance
    - On server, use `next` as app and set express route to `app.render(req, res, '/link')`
    - Does code splitting automatically (each component bundled)
    - Next.js supports advanced features like dynamic imports and dynamic React components, which enable on-demand loading of specific features to optimize load times.
    -  Webpack and Browserify are other options for splitting

- CSS in React
    - `Import styles from app.module.css` and access as `styles.<className>`
    - CSS Modules are 1-1 mapping of css with each component
    - Can use `compose` to inherit properties of other class
    - `classnames` `cx` to combine className css for React Components
    - `https://animate.style/` to find animations

- Security
    - Flow: Type Checker
    <!-- - Not Cross-Origin Resource Sharing (CORS) on server -->
    - Always use SSL Certificate and HTTPS
    - Salting (append deterministic random string for each user) + peppering (add common string)
    - Always use backend for data processing (front-end no data then it needs to know)
    - Tell user errors but without too much info
    - Use `React.StrictMode` to get warnings on Unsafe Lifecycle Methods, Unsafe Lifecycle Methods, Unexpected Side Effects

- GraphQL in React:
    - schema defines your structure of data in your queries.
    - UseEffect to create query and fetch it (will always be post)
    - Can take input in query to make it dynamic
    - Can search using `{a{b(first:10)}}`

----
## React
- React compiler can make 
React Components: 
    - Props can be used to send data as `(props)` or deconstruct it as `({val1, val2})`
    - Keys can be used to keep item in sync

Hooks:
| Hook            | Purpose                            | Syntax                              |
| --------------- | ---------------------------------- | ----------------------------------- |
| `useState`      | Local state                        | `[val, setVal] = useState(init)`    |
| `useEffect`     | Run side effects after render  (data fetch, subscriptions, timers)      | `useEffect(fn, [deps])`             |
| `useReduce`   | Fun on oldState, newState          | `[val, setVal] = useReduce((old, new) => (), default)`           |
| `createContext` | Share global context with child components            | `const C = createContext(default)`  |
| `useContext`    | Consume context value              | `const v = useContext(C)`           |
| `useRef`        | Access DOM components or store mutable value (add as <div ref={r}>) | `const r = useRef(init); r.current` |
| `useMemo`       | Memoize expensive calculation once and not on re-render      | `useMemo(fn, [deps])`               |
| `useCallback`   | Memoize callback when need to pass to child components / not allow rerender          | `useCallback(fn, [deps])`           |
| `React.memo`    | Memoize entire component (child component) re-render | `export default React.memo(Comp)`   |

- Custom Hooks is just a fun with react hooks inside
- `useHistory` replaced by `useNavigation` in new version for browser tab history
- `useNavigate` to just navigate to another page like link (can send state too which can be accessed by `useLocation`)

Routes:
- `react-router-dom` <Router> or <RouterProvider router={path, element}> <Routes> <Route> <Link>
- `/url/:param` can be accessed by `useParams`
- Can load data beforehand using `<RouterProvider loader= () => {}>` or use `useLoaderData()`. Can use param too.
- `BrowserRouter` used HTML5 history API to manage navigation. Keeps UI in sync with route.
- Use `<Route path='*'>` for 404 pages
- `<NavLink>` automatically adds an `active` class to the link when its path matches the current URL, which can be styled using CSS
- `useNavigate` to just navigate to another page like link (can send state too which can be accessed by `useLocation`)
- Nested Routing
    - `<Outlet>` in parent component to tell where to render child component
    - Use `<Route index element={}>` if you need default route for outlet

JSX:
- Allow HTML
- Add data/use JS using `{}`

Testing:
 - Separate as much logic
 - Check input/output in redux
    - Reducers: Separate Slice Definition and check each functions
    - Selectors: Create fake state and pass through selectors
 - Jest
    - Use `test` or `it` to define test
    - Test with data: `expect().toBe/toBeGreater..`
    - `expect(received).toEqual(expect.arrayContaining(subset))`
    - `npm run test -- -- coverage` can show test coverage
    - Use `react-test-renderer` to get snapshot of renderer. `cmt = renderer.create(Component)` -> `cmt.toJSON()` (to get snapshot); ` renderer.act(` to act on renderer. 
    - Can use `describe()` fun as a super class for tests.
 - React Dev Tool: Component Inspection(State, Props), Console Commands ($r), Profiler (perf/timings)
 - Lighthouse Report
---

## Redux

Alternative:
- Recoil: Simpler, wrap your app in `RecoilRoot`. uses `atoms` to create pieces of state 
- MobX: OOPs based, Use the `observer` function from mobx-react-lite to ensure components re-render when MobX state changes. Create a context with `createContext` to provide MobX state to components.

---
- **A Redux app has a single `store` that is passed to React components via a `<Provider>` component**
- **Redux state is updated by "reducer functions"**:
  - Reducers always calculate a new state _immutably_, by copying existing state values and modifying the copies with the new data
  - The Redux Toolkit `createSlice` function generates "slice reducer" functions for you, and lets you write "mutating" code that is turned into safe immutable updates
  - Those slice reducer functions are added to the `reducer` field in `configureStore`, and that defines the data and state field names inside the Redux store
- **React components read data from the store with the `useSelector` hook**
  - Selector functions receive the whole `state` object, and should return a value
  - Selectors will re-run whenever the Redux store is updated, and if the data they return has changed, the component will re-render
- **React components dispatch actions to update the store using the `useDispatch` hook**
  - `createSlice` will generate action creator functions for each reducer we add to a slice
  - Call `dispatch(someActionCreator())` in a component to dispatch an action
  - Reducers will run, check to see if this action is relevant, and return new state if appropriate
  - Temporary data like form input values should be kept as React component state or plain HTML input fields. Dispatch a Redux action to update the store when the user is done with the form.
- **If you're using TypeScript, the initial app setup should define TS types for `RootState` and `AppDispatch` based on the store, and export pre-typed versions of the React-Redux `useSelector` and `useDispatch` hooks**

- **We can create a Redux store using the Redux Toolkit `configureStore` API**
  - `configureStore` accepts a `reducer` function as a named argument
  - `configureStore` automatically sets up the store with good default settings
- **Redux logic is typically organized into files called "slices"**
  - A "slice" contains the reducer logic and actions related to a specific feature / section of the Redux state
  - Redux Toolkit's `createSlice` API generates action creators and action types for each individual reducer function you provide
- **Redux reducers must follow specific rules**
  - Should only calculate a new state value based on the `state` and `action` arguments
  - Must make _immutable updates_ by copying the existing state
  - Cannot contain any asynchronous logic or other "side effects"
  - Redux Toolkit's `createSlice` API uses Immer to allow "mutating" immutable updates
- **Reading values from the state is done with functions called "selectors"**
  - Selectors accept `(state: RootState)` as their argument and either return a value from the state, or derive a new value
  - Selectors can be written in slice files, or inline in the `useSelector` hook
- **Async logic is typically written in special functions called "thunks"**
  - Thunks receive `dispatch` and `getState` as arguments
  - Redux Toolkit enables the `redux-thunk` middleware by default
- **React-Redux allows React components to interact with a Redux store**
  - Wrapping the app with `<Provider store={store}>` enables all components to use the store
  - The `useSelector` hook lets React components read values from the Redux store
  - The `useDispatch` hook lets components dispatch actions
  - For TS usage, we create pre-typed `useAppSelector` and `useAppDispatch` hooks
  - Global state should go in the Redux store, local state should stay in React components


---

## Design Patterns
- Common problems we can abstract

- Layout Component (split screens, lists and items, and modals)
    - split screens: Component with divs
    - List: Individual list component, main component (can pass as `{...{ [resourceName]: item} }` == `resourceName = {item}`)

- Container Component: Parent component that load data
    - Create a patent component with the fetch hook.
    - Eg: Send user `React.children.map(props, child => return React.CloneElement(child, {user} ))`

- Uncontrolled (Manage own internal state)/ Controlled (parent manages the state, easier to test/reuse)
    - Uncontrolled: UseRef and get value when submitting
    - Controlled: UseState to save; useEffect to validate

- Higher-order components (HOCs): functions that take a component and return a new component like a wrapper
    - Fun with component as input: return a function that takes in props, logs them and then return the component with props

- Functional Programming
    - Makes data less mutable
    - Less external datapoints
    - Recursive components: components that refer to themselves within their own body. (Add stopping condition when not object)
    - Composition: the functional programming analog to inheritance in object-oriented programming.
        - Wrap the child in a fun and return with more/updated props
    - Partially applied components: Take in component and semi-props, return component with those semi-props

- Load data in server before SSR
    - When sending in express server, change data to add `<script>${window.prelodedArticles=value}</script>` in the DOM.
    - can access in React component (has access to dom)
    - OR use Context

- Function-Based Organization: separate directories for pages, network, utilities, hooks, and reducers.
- Feature-Based Organization: features of the application, such as articles, sign-ups, and subscriptions


---

SSR Without NextJS

```
import express from 'express';
import React from 'react';
import { ServerStyleSheet } from 'styled-components';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import path from 'path';
import fs from 'fs';
import App from './src/App';

const app = express();

app.use(express.static('./build', { index: false }))

const articles = [
	{ title: 'Article 1', author: 'Bob' },
	{ title: 'Article 2', author: 'Betty' },
	{ title: 'Article 3', author: 'Frank' },
];

app.get('/api/articles', (req, res) => {
	const loadedArticles = articles;
	res.json(loadedArticles);
});

app.get('/*', (req, res) => {
	const sheet = new ServerStyleSheet();

	const reactApp = renderToString(
		sheet.collectStyles(
			<StaticRouter location={req.url}>
				<App />
			</StaticRouter>
		)
	);

	const templateFile = path.resolve('./build/index.html');
	fs.readFile(templateFile, 'utf8', (err, data) => {
		if (err) {
			return res.status(500).send(err);
		}

		return res.send(
			data.replace('<div id="root"></div>', `<div id="root">${reactApp}</div>`)
				.replace('{{ styles }}', sheet.getStyleTags())
		)
	});
});

app.listen(8080, () => {
	console.log('Server is listening on port 8080');
});
```