import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import reducers from './reducers';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

const persistConfig = {
  key: 'root',
  storage,
}
const persistedReducer = persistReducer(persistConfig, reducers)


const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))
let store = createStore(persistedReducer, composedEnhancer)
let persistor = persistStore(store)

export { store, persistor };
