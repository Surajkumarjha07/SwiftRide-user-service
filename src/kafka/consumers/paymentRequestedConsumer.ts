import { payment_requested_consumer } from "../consumerInIt.js";
import handlePaymentRequested from "../handlers/paymentRequestedHandler.js";

async function paymentRequested() {
    try {

        await payment_requested_consumer.subscribe({topic: "payment-requested", fromBeginning: true});
        
        await payment_requested_consumer.run({
            eachMessage: handlePaymentRequested
        })
        
    } catch (error) {
        if (error instanceof Error) {   
            throw new Error(`Error in payment-request consumer: ${error.message}`);
        }
    }
}

export default paymentRequested;