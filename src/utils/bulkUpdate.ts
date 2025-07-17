import _ from "lodash";
import userLocationMap from "../userLocationMap.js";
import bulkInsertDB from "./bulInsertDB.js";

async function bulkUpdate() {
    try {
        let buffer: any[];

        setInterval(async () => {
            buffer = Array.from(userLocationMap.entries());

            if (buffer.length === 0) return;

            console.log("buffer: ", buffer);
            console.log("map: ", userLocationMap.entries());

            const chunks = _.chunk(buffer, 10);

            try {

                await bulkInsertDB(chunks);

                userLocationMap.clear();

            } catch (error) {
                throw new Error("Error in bulk inserting database: " + (error as Error).message);
            }
        }, 60 * 1000);

    } catch (error) {
        throw new Error("Error in bulk updating databse: " + (error as Error).message);
    }
}

export default bulkUpdate;