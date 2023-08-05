import React from "react";
import {Route, Routes, BrowserRouter as Router}  from 'react-router-dom'

import ForgetPassword from "./pages/ForgetPassword";
import LoginRegister from "./pages/LoginRegister"
import Home from "./pages/Home";
import Footer from "./components/Footer";
import ProfilePage from "./pages/ProfilePage";
import ParkingAreaPage from "./pages/ParkingAreaPage";
import OwnerPanel from "./pages/OwnerPanel";
import AdminPanel from "./pages/AdminPanel";
import MyBookedSlots from "./pages/MyBookedSlots";
import RegisterAdmin from "./pages/RegisterAdmin";

const App = ()=> {
  return (
    <React.Fragment>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login-register" element={<LoginRegister/>}/>
        <Route path="/reset-password" element={<ForgetPassword/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/parking-area/:id" element={<ParkingAreaPage/>}/>
        <Route path="/owner-panel" element={<OwnerPanel/>}/>
        <Route path="/admin-panel" element={<AdminPanel/>}/>
        <Route path="/my-bookings" element={<MyBookedSlots/>}/>
        <Route path="/register-admin" element={<RegisterAdmin/>}/>
      </Routes>
    </Router>
    <Footer/>
    </React.Fragment>
  );
}

export default App;
