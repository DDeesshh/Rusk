import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from "react";
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import Home from "./pages/home/Home.jsx";
import About from "./pages/about/About.jsx";
import Menu from './pages/menu/Menu.jsx';
import Contacts from './pages/contacts/Contacts.jsx';

import ThemeSwitch from './components/ui/ThemeSwitch.jsx';
import Button from './components/ui/Button.jsx';
import NavButton from './components/ui/NavButton.jsx';
import RadioButton from './components/ui/RadioButton.jsx';
import Input from './components/ui/Input.jsx';
import ActionButton, { IconButton } from './components/ui/ActionButton.jsx';
import IconDecorate, { Icon } from './components/ui/IconDecorate.jsx';


function App() {
  const [userRole, setUserRole] = useState("guest");

  return (
    <Router>
      <Header userRole={userRole} setUserRole={setUserRole} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About userRole={userRole} setUserRole={setUserRole} />} />
        <Route path="/menu" element={<Menu userRole={userRole} setUserRole={setUserRole} />} />
        <Route path="/contacts" element={<Contacts />} />
      </Routes>
      <Footer />
    </Router>



    // <div>

    //   <div>
    //     <ThemeSwitch />
    //   </div>

    //   <Button text="Забронировать" size='large' className='button mt-5' />

    //   <NavButton text="Главная" className='mt-5' />


    //   <RadioButton label="На дом" name="group1" value="2" />
    //   <RadioButton label="На дом" name="group1" value="3" />

    //   <Input name="name" error="Пожалуйста, заполните поле." placeholder={"Имя"} />
    //   <Input type='date' placeholder="date" />
    //   <Input type='time' placeholder="time" />

    //   <ActionButton iconClass="icon-remove" />
    //   <ActionButton iconClass="icon-add" />
    //   <ActionButton iconClass="icon-saved" />
    //   <ActionButton iconClass="icon-cancel" />
    //   <ActionButton iconClass="icon-ok" />

    //   <IconDecorate iconClass="icon-location" />

    //   <IconButton className="icon-cart"></IconButton>

    //   <Icon className="icon-quote" size="20px" color="var(--primary-color)" />


    // </div>



  );
}

export default App;
