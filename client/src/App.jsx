import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeComponent from "./components/HomePage/HomeComponent"
import ProfilePage from "./pages/ProfilePage.jsx"
import DashboardPage from './pages/DashboardPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

import { GlobalContext, GlobalProvider } from './GlobalContext.js'
import ClimbsPage from './pages/ClimbsPage.jsx';
import ShowFollowers from './components/Profile/Followers';
import ShowFollowing from './components/Profile/Following';
import Profile from "./components/Profile/ProfileComponent"
import FriendsComponent from './components/FriendsStuff/FriendsComponent';



function App() {
    const [Access, SetAccess] = useState(false);
    const ProtectedRoute = ({children}) => {
        if(!Access){
            return <Navigate to="/home"/>
        }
        return children;
    }

    return (
        <GlobalProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/home" element={<HomeComponent Access={Access} SetAccess={SetAccess}/>} />

                    <Route path="profile/dashboard/:userID" element={<ProtectedRoute> <DashboardPage /> </ProtectedRoute>} />
                    <Route path="/profile/info/:userID/:username" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>}></Route>
                    
                    <Route path="followers" element={<ProtectedRoute><ShowFollowers /></ProtectedRoute>} />
                    <Route path="following" element={<ProtectedRoute><ShowFollowing /></ProtectedRoute>} />
                    
                    <Route path="/profile/settings/:userID" element={<ProtectedRoute><SettingsPage/></ProtectedRoute>}></Route>
                    <Route path="/profile/dashboard/:userID/climbs" element={<ProtectedRoute><ClimbsPage/></ProtectedRoute>}></Route>
                    <Route path="/profile/:userID" element={<ProtectedRoute><Profile/></ProtectedRoute>}></Route>
                    
                    <Route path={`/profile/dashboard/friends/:userID`} element={<ProtectedRoute><FriendsComponent/></ProtectedRoute>} />
                    {/* <Route path={`/profile/dashboard/:userID/groups`} element={<ProtectedRoute><Profile/></ProtectedRoute>} />
                    <Route path={`/profile/dashboard/:userID/climbs`} element={<ProtectedRoute><Profile/></ProtectedRoute>} /> */}
                </Routes>
            </BrowserRouter>
        </GlobalProvider>
    );

}

export default App;
