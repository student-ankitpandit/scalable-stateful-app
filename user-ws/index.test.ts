import { describe, test } from "bun:test";

const BACKEND_URL = "http://localhost:8080"

describe("chat application",  () => {
    test("message send from room 1 should reach to another participant in room 1", async () => {
        const ws1 = new WebSocket(BACKEND_URL)
        const ws2 = new WebSocket(BACKEND_URL)

        //need to make sure both sockest are connected

        await new Promise<void>((resolve, reject) => {
            let count = 0
            ws1.onopen = () => {
                count = count + 1;
                if(count == 2) {
                    resolve()
                }
            }
            ws1.onopen = () => {
                count = count + 1;
                if(count == 2) {
                    resolve()
                }
            }
        })

        console.log("control will only reach here when above sockets are connected successfully")

        ws1.send(JSON.stringify({
            type: "join-room",
            room: "Room 1"
        }))

        ws2.send(JSON.stringify({
            type: "join-room",
            room: "Room 1"
        }))

        ws2.send(JSON.stringify({
            type: "chat",
            room: "Room 1",
            message: "hi there"
        }))
    })
})