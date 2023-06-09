import RegistrationForm from "./components/RegistrationForm";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import LoginForm from "./components/LoginForm";
import HomePage from "./components/HomePage";
import {useContext} from "react";
import {Context} from "./index";
function App() {
    const {store} = useContext(Context)
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginForm/>}></Route>
            <Route path='/register' element={<RegistrationForm/>}></Route>
            <Route path='/home' element={<HomePage/>}></Route>
        </Routes>
      </BrowserRouter>
  );
}
export default App;
