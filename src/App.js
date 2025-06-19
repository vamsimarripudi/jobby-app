import {Switch, Route} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
<<<<<<< HEAD
import Jobs from './components/Jobs'
=======
>>>>>>> ea3680e4cef7e9838e3376b71ff514c19f64aafc
import NotFound from './components/NotFound'

import './App.css'

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
<<<<<<< HEAD
    <ProtectedRoute exact path="/jobs" component={Jobs} />
=======
>>>>>>> ea3680e4cef7e9838e3376b71ff514c19f64aafc
    <Route component={NotFound} />
  </Switch>
)

export default App
