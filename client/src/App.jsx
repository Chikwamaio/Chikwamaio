import {
  HashRouter,
  Route,
  Routes,
} from "react-router-dom";
import './App.css';

import CashPoints from './components/CashPoints';
import Dao from './components/Dao';
import Home from './components/Home';
import LandingPage from './components/LandingPage';
import React from "react";

function App() {
  return ( <>
    <HashRouter>
      <Routes>
        <Route path='/Landing' element={<LandingPage/>}></Route>
        <Route path='/Home' element={<Home />}>
        </Route>
        <Route path='/CashPoints' element={<CashPoints />}>
        </Route>
        <Route path='/Dao' element={<Dao />}>
        </Route>
          <Route path='*'  element={<LandingPage />}>
          </Route>
          </Routes>
    </HashRouter> 
    </>);
}

export default App
