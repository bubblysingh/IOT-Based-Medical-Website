import requests
import time
import random
from datetime import datetime

# Simulated device ID
DEVICE_ID = "ESP32_TEST_01"
API_URL = "http://localhost:5000"

def generate_reading():
    return {
        "device_id": DEVICE_ID,
        "hr": random.uniform(60, 100),  # Normal heart rate range
        "spo2": random.uniform(95, 100),  # Normal SpO2 range
        "temp": random.uniform(36.1, 37.2),  # Normal body temperature range
        "hum": random.uniform(40, 60),  # Normal humidity range
        "_recv_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

def register_device():
    try:
        response = requests.post(f"{API_URL}/register", json={"device_id": DEVICE_ID})
        print(f"Device registration: {response.status_code}")
    except Exception as e:
        print(f"Registration error: {e}")

def send_data():
    try:
        data = generate_reading()
        response = requests.post(f"{API_URL}/data", json=data)
        print(f"Sent data: {data}")
        print(f"Response: {response.status_code}")
    except Exception as e:
        print(f"Error sending data: {e}")

def main():
    print("Starting test data generator...")
    register_device()
    
    while True:
        send_data()
        time.sleep(1)  # Send data every second

if __name__ == "__main__":
    main()