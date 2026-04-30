import React from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import { applyMiddleware, createStore } from "redux"
import { Provider } from "react-redux"
import thunk from "redux-thunk"

import Home from "./Pages/Home"
import ContactUs from "./Pages/ContactUs"
import Project from "./Pages/Project"
import Studio from "./Pages/Studio"
import Navbar from "./components/Navbar"
import allReducer from "./Redux/Reducer/index"
import Login from "./Pages/Admin/Login"
import Dashboard from "./Pages/Admin/Dashboard"
import PrivateRoute from "./components/PrivateRoute"
import ApiProjectDetail from "./Pages/projectdetail/ApiProjectDetail"

const store = createStore(allReducer, applyMiddleware(thunk))

function AdminRoutes() {
  return (
    <Switch>
      <Route exact path="/admin" component={Login} />
      <PrivateRoute path="/admin/dashboard" component={Dashboard} />
    </Switch>
  )
}

function PublicRoutes() {
  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/project" component={Project} />
        <Route path="/studio" component={Studio} />
        <Route path="/contactus" component={ContactUs} />
        <Route path="/:slug" component={ApiProjectDetail} />
      </Switch>
    </>
  )
}

function App() {
  document.title = "Joshua Aditama"
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/admin" component={AdminRoutes} />
          <Route component={PublicRoutes} />
        </Switch>
      </BrowserRouter>
    </Provider>
  )
}

export default App
