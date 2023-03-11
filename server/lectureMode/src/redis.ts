import { createClient, SchemaFieldTypes } from "redis"
import { Lecture } from "./types"

export default async () => {

    const url = 'redis://localhost:6340'

    const client = createClient({ url })

    await client.connect()

    try {
        await client.ft.create('idx:lectures', {
            teacher: SchemaFieldTypes.TEXT,
            studentCount: SchemaFieldTypes.NUMERIC,
            socketID: SchemaFieldTypes.TEXT,
            lectureID: SchemaFieldTypes.NUMERIC
        }, {
            ON: "HASH",
            PREFIX: "classroom:lectures"
        })
    } catch (e) { console.log(e) }

    return client
}

export const convertToLectureType = (out): Lecture => {
    return {
        teacher: out[1],
        studentCount: parseInt(out[3]),
        socketID: out[5]
    }
}