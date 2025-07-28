import _ from "lodash";
import userLocationMap from "../userLocationMap.js";
import bulkInsertDB from "./bulknsertDB.js";

async function bulkUpdateLocation() {
    try {
        let buffer: any[];

        setInterval(async () => {
            buffer = Array.from(userLocationMap.entries());

            if (buffer.length === 0) return;

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

export default bulkUpdateLocation;