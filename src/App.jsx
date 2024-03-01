import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const App = () => {
  const [notification, setNotification] = useState(null);
  const [socket, setSocket] = useState(null);
  const nombre = 'Juan';
  const apellido = 'Pérez';
  const cantidad = '50';
  const producto = 'Coca Cola';
  const telefono = '932 111 47 13';

  useEffect(() => {
    const newSocket = new WebSocket('ws://3.215.18.246:4000');
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log('Conexión WebSocket establecida correctamente');
    };

    newSocket.onmessage = handleWebSocketMessage;

    window.addEventListener('beforeunload', handleCloseWebSocket);

    return () => {
      handleCloseWebSocket();
      window.removeEventListener('beforeunload', handleCloseWebSocket);
    };
  }, []);

  const handleWebSocketMessage = (event) => {
    const data = JSON.parse(event.data);
    setNotification(data);

    setTimeout(() => {
      setNotification(null);
    }, 10000);
  };

  const handleEnviarPagos = async () => {
    try {
      const response = await axios.post('http://52.5.151.241/pagos', {
        nombre,
        apellido,
        cantidad,
        producto,
        telefono
      });
      console.log('Pago enviado correctamente:', response.data);
    } catch (error) {
      console.error('Error al enviar el pago:', error);
    }
  };

  const handleCloseWebSocket = () => {
    if (socket) {
      socket.close();
    }
  };

  return (
    <div className="app-container">
      <h1>Realizar Pagos</h1>
      {notification && (
        <div className="notification">
          {notification.message}
        </div>
      )}
      <div className="pagos-form">
        <button onClick={handleEnviarPagos}>Enviar Pagos</button>
      </div>
    </div>
  );
};

export default App;
