import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Edit from './Edit';
import SideDrawer from './SideDrawer';

const Main = () => {

  return (
    <SideDrawer>
      <Routes>
        <Route path="/" element={<Edit />} />
      </Routes>
    </SideDrawer>
  );
}

export default Main;
