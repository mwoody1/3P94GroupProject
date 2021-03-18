import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Edit from './Edit';
import Help from './Help';
import Shortcuts from './Shortcuts';
import SideDrawer from './SideDrawer';

const Main = () => {

  return (
    <SideDrawer>
      <Routes>
        <Route path="/" element={<Edit />} />
        <Route path="/hotkeys" element={<Shortcuts />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </SideDrawer>
  );
}

export default Main;
