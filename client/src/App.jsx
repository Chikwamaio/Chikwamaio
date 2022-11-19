import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';

import Home from './components/Home';
import CashPoints from './components/CashPoints';
import Dao from './components/Dao';


function App() {
  return ( <>
    <BrowserRouter>
      <Routes>
        <Route path='/Home' element={<Home />}>
        </Route>
        <Route path='/CashPoints' element={<CashPoints />}>
        </Route>
        <Route path='/Dao' element={<Dao />}>
        </Route>
          <Route path='/'  element={<Home />}>
          </Route>
          </Routes>
    </BrowserRouter> 
    </>);
}

export default App
