import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeComponent from "./components/HomeComponent"
import Profile from "./components/Profile/Profile"
import UserPage from './pages/UserPage';


function App() {
    const [Access, SetAccess] = useState(false);
    const ProtectedRoute = ({children}) => {
        if(!Access){
            return <Navigate to="/home"/>
        }
        return children;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<HomeComponent Access={Access} SetAccess={SetAccess}/>} />

                <Route path="profile/home/:userID" element={<ProtectedRoute> <UserPage /> </ProtectedRoute>} />
                <Route path="/profile/:userID" element={<ProtectedRoute><Profile/></ProtectedRoute>}></Route>

            </Routes>

        </BrowserRouter>
    );

}

export default App;
