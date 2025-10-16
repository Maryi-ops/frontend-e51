import React, { useState } from 'react';


const Contador = () => {

    const [contador, setContador] = useState(0);
    const incrementar = () => {
        setContador(contador + 1);
    }
    const decrementar = () => {
        setContador(contador - 1);
    }
    const resetear = () => {
        setContador(0);
    }
    return (
        <div>
            <h1>Contador: {contador}</h1>
            <button onClick={incrementar}
            >Incrementar 
            </button>

            <button onClick={decrementar}
            >Decrementar 
            </button>
            <button onClick={resetear}
            >Resetear
            </button>
        </div>
    );
}

export default Contador;