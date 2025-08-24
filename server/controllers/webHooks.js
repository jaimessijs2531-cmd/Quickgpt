import Strip from 'stripe'
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

export const stripWebHooks = async(request,response)=>{
const stripe = new Strip(process.env.STRIPE_WEBHOOK_SECRET)
const sig = request.header["stripe-signature"];

let event;

try {
    event = stripe.webhooks.constructEvent(request.body,sig,process.env.STRIPE_WEBHOOK_SECRET)
} catch (error) {
    return response.status(400).send(`WebHook Error:${error.message}`)
}

try {
    switch (event.type) {
        case "payment_intent.succeeded":{
            const paymentIntent = event.data.object;
            const sessionList = await stripe.checkout.sessions.list({
                payment_intent:paymentIntent.id,
            })

            const session = sessionList.data[0];
            const {transactionId,appId} = session.metadata;
            if(appId ==='quickgpt'){
                const transaction = await Transaction.findOne({_id:transactionId,isPaid:false})
                await User.updateOne({_id:transaction.userId},{$inc:{credits:transaction.credits}})

                transaction.isPaid= true;
                await transaction.save();
            }else{
                return response.json({received:true,message:"Ignore event:Invalid App"})
            }
            break;
        }
        default:
            console.log("unhanlded event Type:",event.type);
            break;
    }
    response.json({received:true})
} catch (error) {
    console.error("webhook processing error:",error)
    response.status(500).send("internal server error")
}
}