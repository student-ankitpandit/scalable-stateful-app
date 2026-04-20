import { describe, expect, test } from "bun:test";

const BACKEND_URL1 = "http://localhost:8080"
const BACKEND_URL2 = "http://localhost:8081"

describe("chat application", () => {
    test("message send from room 1 should reach to another participant in room 1", async () => {
        const ws1 = new WebSocket(BACKEND_URL1)
        const ws2 = new WebSocket(BACKEND_URL2)

        //need to make sure both sockest are connected
        
        console.log("hi")
        await new Promise<void>((resolve, reject) => {
            let count = 0
            ws1.onopen = () => {
                count = count + 1;
                if(count == 2) {
                    resolve()
                }
            }
            ws2.onopen = () => {
                count = count + 1;
                if(count == 2) {
                    resolve()
                }
            }
        })

        console.log("hello")

        // console.log("control will only reach here when above sockets are connected successfully")

        ws1.send(JSON.stringify({
            type: "join-room",
            room: "Room 1"
        }))

        ws2.send(JSON.stringify({
            type: "join-room",
            room: "Room 1"
        }))

        await new Promise<void>((res, rej) => {
                ws2.onmessage = ({data}) => {
                console.log(data)
                const parsedData = JSON.parse(
                    typeof data === "string" ? data : data.toString()
                )
                expect(parsedData.type == "chat")
                expect(parsedData.message == "hi there")
                res()
            }

            ws1.send(JSON.stringify({
                type: "chat",
                room: "Room 1",
                message: "hi there"
            }))
        })
            
        
        
    })
})