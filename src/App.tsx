import React,{ useState } from 'react'  
import Login from "./components/Login" 
import Home from "./components/Home"
import { BrowserRouter as Router,Routes } from 'react-router-dom'
import { Route } from 'react-router'

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Home/>} />
      </Routes>
       
    </Router>
  )
}

export default App
