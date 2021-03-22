import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Project from '../pages/Project';
import Help from '../pages/Help';
import About from '../pages/About';
import Shortcuts from '../pages/Shortcuts';
import SideDrawer from './SideDrawer';

const Main = () => {

  return (
    <SideDrawer>
      <Routes>
        <Route path="/" element={<Project />} />
        <Route path="/hotkeys" element={<Shortcuts />} />
        <Route path="/help" element={<Help />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </SideDrawer>
  );
}

export default Main;
