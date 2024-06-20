// ChartModal.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const ChartModal = ({ onClose }) => {
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Price',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '300px',
      height: '300px',
      backgroundColor: 'white',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    }}>
      {/* <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px' }}>X</button> */}
      <Line data={chartData} options={chartOptions} />
    </div>,
    document.body
  );
};

export default ChartModal;
