import React, { useState, useEffect, useRef } from 'react';
import { Activity, Battery, Thermometer, Droplets, Gauge, Zap, Video, ArrowLeft } from 'lucide-react';
import './App.css'; // Make sure your CSS file is named App.css or index.css

const RobotDashboard = () => {
  const [currentPage, setCurrentPage] = useState('telemetry');
  const [selectedCamera, setSelectedCamera] = useState('front1');
  const [speed, setSpeed] = useState({ x: 0, y: 0, z: 0 });
  const [pwm, setPwm] = useState({ FL: 0, FR: 0, RL: 0, RR: 0, SL: 0, SR: 0, SF: 0, SB: 0 });
  const [battery, setBattery] = useState({ level: 0, temp: 0 });
  const [flashlight, setFlashlight] = useState(0);
  const [bar30, setBar30] = useState({ pressure: 0, temp: 0 });
  const [connected, setConnected] = useState(false);

  const videoRef = useRef(null);

  const cameraOptions = [
    { value: 'front1', label: 'Front Camera 1' },
    { value: 'front2', label: 'Front Camera 2' },
    { value: 'rear', label: 'Rear Camera' },
    { value: 'gripper', label: 'Gripper Camera' }
  ];

  // useEffect(() => {
  //   // WebSocket simulation logic remains the same
  //   const interval = setInterval(() => {
  //     setSpeed({
  //       x: (Math.random() * 2 - 1).toFixed(2),
  //       y: (Math.random() * 2 - 1).toFixed(2),
  //       z: (Math.random() * 2 - 1).toFixed(2)
  //     });
  //     setPwm({
  //       FL: Math.floor(Math.random() * 255),
  //       FR: Math.floor(Math.random() * 255),
  //       RL: Math.floor(Math.random() * 255),
  //       RR: Math.floor(Math.random() * 255),
  //       SL: Math.floor(Math.random() * 255),
  //       SR: Math.floor(Math.random() * 255),
  //       SF: Math.floor(Math.random() * 255),
  //       SB: Math.floor(Math.random() * 255)
  //     });
  //     setBattery({
  //       level: 75 + Math.random() * 20,
  //       temp: 35 + Math.random() * 10
  //     });
  //     setFlashlight(Math.random() > 0.5 ? 1 : 0);
  //     setBar30({
  //       pressure: 1000 + Math.random() * 100,
  //       temp: 20 + Math.random() * 5
  //     });
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  const getBatteryColorClass = (level) => {
    if (level > 60) return 'green';
    if (level > 30) return 'yellow';
    return 'red';
  };

  // Telemetry Page Component
  const TelemetryPage = () => (
    <div className="telemetry-wrapper">
      <div className="telemetry-grid">
        {/* Speed Card */}
        <div className="card">
          <div className="card-header">
            <Activity className="icon-blue" size={20} />
            <h3 className="card-title">Speed (m/s)</h3>
          </div>
          <div className="card-body">
            <div className="data-row">
              <span className="data-label">X:</span>
              <span className="data-value cyan">{speed.x}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Y:</span>
              <span className="data-value cyan">{speed.y}</span>
            </div>
            <div className="data-row">
              <span className="data-label">Z:</span>
              <span className="data-value cyan">{speed.z}</span>
            </div>
          </div>
        </div>

        {/* Battery Card */}
        <div className="card">
          <div className="card-header">
            <Battery className={`icon-${getBatteryColorClass(battery.level)}`} size={20} />
            <h3 className="card-title">Battery</h3>
          </div>
          <div className="card-body">
            <div className="data-row">
              <span className="data-label">Level:</span>
              <span className={`data-value ${getBatteryColorClass(battery.level)}`}>
                {battery.level.toFixed(1)}%
              </span>
            </div>
            <div className="progress-bar-container">
              <div
                className={`progress-bar ${getBatteryColorClass(battery.level)}`}
                style={{ width: `${battery.level}%` }}
              />
            </div>
            <div className="data-row">
              <span className="data-label">Temp:</span>
              <span className="data-value orange">{battery.temp.toFixed(1)}°C</span>
            </div>
          </div>
        </div>

        {/* Bar30 Card */}
        <div className="card">
          <div className="card-header">
            <Gauge className="icon-purple" size={20} />
            <h3 className="card-title">Bar30 Sensor</h3>
          </div>
          <div className="card-body">
            <div className="data-row">
              <span className="data-label">Pressure:</span>
              <span className="data-value purple">{bar30.pressure.toFixed(1)} mbar</span>
            </div>
            <div className="data-row">
              <span className="data-label">Temp:</span>
              <span className="data-value purple">{bar30.temp.toFixed(1)}°C</span>
            </div>
          </div>
        </div>

        {/* Flashlight Card */}
        <div className="card">
          <div className="card-header">
            <Zap className={flashlight ? 'icon-yellow' : 'icon-gray'} size={20} />
            <h3 className="card-title">Flashlight</h3>
          </div>
          <div className={`flashlight-status ${flashlight ? 'on' : 'off'}`}>
            {flashlight ? 'ON' : 'OFF'}
          </div>
        </div>
      </div>

      {/* PWM Signals Grid */}
      <div className="card mb-6">
        <div className="card-header">
          <Droplets className="icon-cyan" size={20} />
          <h3 className="card-title">PWM Signals</h3>
        </div>
        <div className="pwm-grid">
          {Object.entries(pwm).map(([key, value]) => (
            <div key={key} className="pwm-signal">
              <div className="data-row">
                <span className="data-label">{key}:</span>
                <span className="data-value cyan">{value}</span>
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar cyan"
                  style={{ width: `${(value / 255) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="nav-center">
        <button className="btn btn-primary" onClick={() => setCurrentPage('camera')}>
          <Video size={20} />
          View Camera Feeds
        </button>
      </div>
    </div>
  );

  const CameraPage = () => (
    <div className="camera-view-container">
      <button className="btn-back mb-4" onClick={() => setCurrentPage('telemetry')}>
        <ArrowLeft size={20} />
        Back to Telemetry
      </button>

      <div className="camera-selector">
        <label>Select Camera Feed</label>
        <select
          className="camera-select"
          value={selectedCamera}
          onChange={(e) => setSelectedCamera(e.target.value)}
        >
          {cameraOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="video-container">
        <div className="video-header">
          <div className="video-title">
            <Video size={20} className="icon-cyan" />
            <span>{cameraOptions.find(opt => opt.value === selectedCamera)?.label}</span>
          </div>
          <div className="live-indicator">
            <div className="live-dot" />
            <span className="live-text">LIVE</span>
          </div>
        </div>
        <div className="video-wrapper">
          <video ref={videoRef} autoPlay playsInline />
          <div className="video-placeholder">
            <Video size={64} />
            <p className="video-placeholder-text">Stream: {selectedCamera.toUpperCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Robot Control Dashboard</h1>
          <div className="connection-status">
            <div className={`status-indicator ${connected ? 'connected' : 'disconnected'}`} />
            <span className="status-text">{connected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </header>

        {currentPage === 'telemetry' ? <TelemetryPage /> : <CameraPage />}
      </div>
    </div>
  );
};

export default RobotDashboard;