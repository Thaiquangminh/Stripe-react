const stripeAPI = require('../stripe');

async function createCheckoutSession(req, res) {
    const domainUrl = process.env.WEB_APP_URL;
    const {line_items, customer_email} = req.body;
    // check req body has line items and email
    if (!line_items || !customer_email) {
        console.log(customer_email)
        return res.status(400).json({error: 'missing required session parameters'});
    }

    let session;
    try {
        session = await stripeAPI.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            customer_email,
            success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domainUrl}/canceled`,
            shipping_address_collection: {allowed_countries: ['GB', 'US']},
            custom_text: {
                shipping_address: {
                    message: 'Please note that we can\'t guarantee 2-day delivery for PO boxes at this time.',
                },
                submit: {
                    message: 'We\'ll email you instructions on how to get started.',
                },
            },
            custom_fields: [
                {
                    key: 'engraving',
                    label: {
                        type: 'custom',
                        custom: 'Personalized engraving',
                    },
                    type: 'text',
                },
            ],
        });
        res.status(200).json({sessionId: session.id,});
    } catch (error) {
        console.log(error);
        res.status(400).json({error: 'an error occured, unable to create session'});
    }
}

module.exports = createCheckoutSession;