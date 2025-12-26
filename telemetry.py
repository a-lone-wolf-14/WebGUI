import time
import serial
import websockets
import asyncio
import json
import random

async def send_telemetry():
    uri="ws://localhost:8765"
    async with websockets.connect(uri) as websocket:
        while True:
            voltage=random.uniform(12,16)
            level=((voltage-12)/4)*100
            telemetry={
                "imu":
                {
                    "yaw":random.uniform(0,360),
                    "pitch":random.uniform(0,360),
                    "roll":random.uniform(0,360)
                },
                "angularVelocity":
                {
                    "yaw":random.uniform(0,5),
                    "pitch":random.uniform(0,5),
                    "roll":random.uniform(0,5)
                },
                "speed":
                {
                    "x":random.uniform(0,10),
                    "y":random.uniform(0,10),
                    "z":random.uniform(0,10)
                },
                "battery":
                {
                    "voltage":voltage,
                    "level":level,
                    "temp":random.uniform(20,40)
                },
                "bar30":
                {
                    "pressure":random.uniform(950,1050),
                    "temp":random.uniform(20,40)
                },
                "flashlight":
                {
                    "state":random.choice([0,1])
                },
                "pwm":
                {
                    "FL":random.randint(1100,1900),
                    "FR":random.randint(1100,1900),
                    "BL":random.randint(1100,1900),
                    "BR":random.randint(1100,1900),
                    "SL":random.randint(1100,1900),
                    "SR":random.randint(1100,1900),
                    "SF":random.randint(1100,1900),
                    "SB":random.randint(1100,1900)
                }
            }

            data_string=json.dumps(telemetry)

            await websocket.send(data_string)

            await asyncio.sleep(2)

asyncio.run(send_telemetry())