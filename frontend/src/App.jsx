
import './style/App.css'
import NavBar from './components/NavBar';
import { Route, Routes } from 'react-router-dom';
import AddTask from './components/AddTask';
import List from './components/List';
import SignUp from './components/SignUp';
import Login   from './components/Login';
import Protected from './components/Protected';



function App() {
  
  

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<Protected><List /></Protected>}/>
        <Route path='/add' element={<Protected><AddTask/></Protected>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </>
  )
}

export default App;
