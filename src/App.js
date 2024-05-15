// App.js
// import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import ProductListPage from './components/ProductListPage'
import AddProductPage from './components/AddProductPage'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={ProductListPage} />
        <Route exact path="/add" component={AddProductPage} />
      </Switch>
    </Router>
  )
}

export default App
