"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const stripe = require("stripe")(
  "sk_test_51NaL67HVFtwteNkVPh4SxA0JYH6bmrivWDF8QJia6EKkoP52Tar7gMSsjAKcw4j2KlFbXduugyybRc7IjPQFP38k00MmTgWB4f"
);

module.exports = {
  //注文を作成する
  create: async (ctx) => {
    const { address, amount, dishes, token } = JSON.parse(ctx.request.body);
    // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
    const charge = await stripe.charges.create({
      amount: amount,
      currency: "jpy",
      source: token,
      description: `Order ${new Date()} by ${ctx.state.user._id}`,
    });

    const order = await strapi.services.order.create({
      user: ctx.state.user._id,
      //strapi.services.order.createメソッドのcharge変数のid
      charge_id: charge.id,
      amount: amount,
      address,
      dishes,
    });

    return order;

  },
};
