import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SPO2_ALERT = 90.0;
const HR_LOW = 45.0;
const HR_HIGH = 120.0;
const MAXPOINTS = 60;

const Readings = () => {
  const [currentDevice, setCurrentDevice] = useState('');
  const [devices, setDevices] = useState([]);
  const [latestData, setLatestData] = useState({
    hr: '--',
    spo2: '--',
    temp: '--',
    hum: '--',
    device_id: '-',
    _recv_time: '-'
  });
  const [chartData, setChartData] = useState({
    hr: [],
    spo2: [],
    temp: []
  });

  // refs for canvases and Chart instances
  const hrRef = useRef(null);
  const spo2Ref = useRef(null);
  const tempRef = useRef(null);
  const hrChartRef = useRef(null);
  const spo2ChartRef = useRef(null);
  const tempChartRef = useRef(null);

  // Initialize charts when component mounts
  useEffect(() => {
    try {
      const createChart = (canvas, color) => {
        return new ChartJS(canvas, {
          type: 'line',
          data: {
            labels: [],
            datasets: [{
              data: [],
              borderColor: color,
              tension: 0.25,
              pointRadius: 0,
              borderWidth: 2
            }]
          },
          options: {
            animation: false,
            responsive: true,
            scales: { x: { display: false }},
            plugins: { legend: { display: false }}
          }
        });
      };

      if (hrRef.current) hrChartRef.current = createChart(hrRef.current, '#ff6361');
      if (spo2Ref.current) spo2ChartRef.current = createChart(spo2Ref.current, '#36a2eb');
      if (tempRef.current) tempChartRef.current = createChart(tempRef.current, '#f7b267');

      return () => {
        try { hrChartRef.current?.destroy(); } catch(e){}
        try { spo2ChartRef.current?.destroy(); } catch(e){}
        try { tempChartRef.current?.destroy(); } catch(e){}
      };
    } catch (e) {
      // if chart creation fails, log and continue so UI still renders
      // eslint-disable-next-line no-console
      console.error('Error initializing charts', e);
    }
  }, []);

  // Fetch devices list
  const fetchDevices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/devices');
      setDevices(response.data);
      if (!currentDevice && response.data.length) {
        setCurrentDevice(response.data[response.data.length - 1]);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  // Fetch and update data
  const fetchAndRender = async () => {
    if (!currentDevice) return;
    try {
      const response = await axios.get(`http://localhost:5000/records?device=${currentDevice}`);
      const data = response.data;
      if (!data || data.length === 0) return;

      const last = data[data.length - 1];
      setLatestData(last);

      const slice = data.slice(-MAXPOINTS);
      const newChartData = {
        hr: slice.map(s => s.hr ?? null),
        spo2: slice.map(s => s.spo2 ?? null),
        temp: slice.map(s => s.temp ?? null)
      };
      setChartData(newChartData);

      // Update charts if they exist
      try {
        if (hrChartRef.current) {
          hrChartRef.current.data.labels = newChartData.hr.map((_, i) => i);
          hrChartRef.current.data.datasets[0].data = newChartData.hr;
          hrChartRef.current.update();
        }
        if (spo2ChartRef.current) {
          spo2ChartRef.current.data.labels = newChartData.spo2.map((_, i) => i);
          spo2ChartRef.current.data.datasets[0].data = newChartData.spo2;
          spo2ChartRef.current.update();
        }
        if (tempChartRef.current) {
          tempChartRef.current.data.labels = newChartData.temp.map((_, i) => i);
          tempChartRef.current.data.datasets[0].data = newChartData.temp;
          tempChartRef.current.update();
        }
      } catch (e) {
        console.error('Error updating charts', e);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  // Set up polling intervals
  useEffect(() => {
    fetchDevices();
    const devicesInterval = setInterval(fetchDevices, 15000);
    const dataInterval = setInterval(fetchAndRender, 1000);
    return () => {
      clearInterval(devicesInterval);
      clearInterval(dataInterval);
    };
  }, [currentDevice]);

  const handleClear = async () => {
    if (!currentDevice) {
      alert('Pick a device first');
      return;
    }
    if (!window.confirm('Clear data for ' + currentDevice + '?')) return;
    
    try {
      await axios.post('http://localhost:5000/clear', { device: currentDevice });
      setLatestData({
        hr: '--',
        spo2: '--',
        temp: '--',
        hum: '--',
        device_id: '-',
        _recv_time: '-'
      });
      setChartData({ hr: [], spo2: [], temp: [] });
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const showAlerts = () => {
    const alerts = [];
    if (latestData.spo2 !== '--' && latestData.spo2 < SPO2_ALERT) {
      alerts.push(`Low SpO₂: ${latestData.spo2}%`);
    }
    if (latestData.hr !== '--' && (latestData.hr < HR_LOW || latestData.hr > HR_HIGH)) {
      alerts.push(`Abnormal HR: ${latestData.hr} bpm`);
    }
    return alerts;
  };

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="text-zinc-500">Live vitals from ESP devices</div>
          <div className="d-flex gap-2 align-items-center">
          <select 
            className="form-select form-select-sm" 
            style={{width: '260px'}}
            value={currentDevice}
            onChange={(e) => setCurrentDevice(e.target.value)}
          >
            <option value="">-- select device --</option>
            {devices.map(device => (
              <option key={device} value={device}>{device}</option>
            ))}
          </select>
          <button onClick={handleClear} className="px-3 py-1 border rounded hover:bg-gray-100">Clear</button>
          <a href="http://localhost:5000/export" target="_blank" rel="noopener noreferrer" className="px-3 py-1 border rounded hover:bg-gray-100">
            Export CSV
          </a>
        </div>
      </div>

      {showAlerts().map((alert, index) => (
        <div key={index} className={`alert ${alert.includes('SpO₂') ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'} p-3 mb-3 rounded`}>
          {alert}
        </div>
      ))}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <h6 className="mb-2 text-zinc-500">Latest</h6>
            <div>
              <div className="flex justify-content-between">
                <div>
                  <div className="text-zinc-500">Heart Rate</div>
                  <div className="text-xl font-bold">
                    {latestData.hr} <span className="text-zinc-400 text-base">bpm</span>
                  </div>
                </div>
                <div>
                  <div className="text-zinc-500">SpO₂</div>
                  <div className="text-xl font-bold">
                    {latestData.spo2} <span className="text-zinc-400 text-base">%</span>
                  </div>
                </div>
              </div>
              <hr className="my-3"/>
              <div className="flex justify-content-between">
                <div>
                  <div className="text-zinc-500">Temperature</div>
                  <div className="text-xl font-bold">
                    {latestData.temp} <span className="text-zinc-400 text-base">°C</span>
                  </div>
                </div>
                <div>
                  <div className="text-zinc-500">Humidity</div>
                  <div className="text-xl font-bold">
                    {latestData.hum} <span className="text-zinc-400 text-base">%</span>
                  </div>
                </div>
              </div>
              <hr className="my-3"/>
              <div className="text-zinc-500">Device: <span>{latestData.device_id}</span></div>
              <div className="text-zinc-500">Received: <span>{latestData._recv_time}</span></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white p-4 rounded-xl shadow">
            <h6 className="mb-2 text-zinc-500">Trends (last samples)</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[220px]">
                <canvas id="hrChart" ref={hrRef}></canvas>
              </div>
              <div className="h-[220px]">
                <canvas id="spo2Chart" ref={spo2Ref}></canvas>
              </div>
              <div className="h-[220px] md:col-span-2">
                <canvas id="tempChart" ref={tempRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-3">
        <div className="flex justify-between text-zinc-500 text-sm">
          <div>Server: <code>localhost:5000</code></div>
          <div>SpO₂ alert &lt; {SPO2_ALERT} · HR alert &lt; {HR_LOW} or &gt; {HR_HIGH}</div>
        </div>
      </footer>
    </div>
  );
};

export default Readings;
