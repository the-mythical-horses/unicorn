/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export {default as Navbar} from './navbar';
export {default as UserHome} from './user-home';
export {Login, Signup} from './auth-form';
export {default as Profile} from './profile';
export {default as Search} from './search';
export {default as Compare} from './compare';
export {default as Home} from './home';
export {default as CompareDisplay} from './compare-display';
