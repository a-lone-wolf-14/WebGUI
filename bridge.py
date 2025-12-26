import asyncio
import websockets

CLIENTS = set()

async def handler(websocket):
    CLIENTS.add(websocket)
    try:
        async for message in websocket:
            # print("RECEIVED: ",message)
            for client in CLIENTS:
                if client != websocket:
                    await client.send(message)
    finally:
        CLIENTS.remove(websocket)

async def main():
    async with websockets.serve(handler, "0.0.0.0", 8765):
        await asyncio.Future()

asyncio.run(main())
