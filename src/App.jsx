import { useState } from 'react'
import './App.css';
import Titulo from './components/Titulo';
import Mensaje from './components/Mensaje';

const App = () => {
  return (
    <>
      <h1>Ferreteria-Maryi</h1>
      <Titulo />
      <Mensaje />
    </>
  )
}

export default App;
