# Project requirements
[Durand doc](https://duranda.github.io/ase2020-docs/project-2020)

# Error/Performance logging
* [GitHub - cheeaun/javascript-error-logging: A collection of JavaScript error logging services, resources and shiny things.](https://github.com/cheeaun/javascript-error-logging)
* [Sentry for Education | Sentry](https://sentry.io/for/education/)
* [Pricing Plans — Stability and Error Monitoring  |  Bugsnag](https://www.bugsnag.com/pricing)
* [Raygun Pricing](https://raygun.com/pricing)
* [Priced For You - TrackJS](https://trackjs.com/pricing/)
* [User feedback is priceless but ... | Usersnap Pricing](https://usersnap.com/pricing)

**Choice**: [Sentry](sentry.io) as it is free for students, heard about it already (through ads, definitely worked),
and also announced to be open-source (:shrug:).

## Sentry articles/documentations
[Sentry](sentry.io) is an open-source error tracking that is free for students.

### Articles
* Node: [Usage | Sentry Documentation](https://docs.sentry.io/clients/node/usage/)
* [Vue | Sentry Documentation](https://docs.sentry.io/platforms/javascript/guides/vue/)
    * Doesn't need to add middleware or what so ever. Does it all with the Vue ref already.
* [Express | Sentry Documentation](https://docs.sentry.io/platforms/node/guides/express/)
* [Koa | Sentry Documentation](https://docs.sentry.io/platforms/node/guides/koa/)
---
More in depth doc:
* [Transaction Summary | Sentry Documentation](https://docs.sentry.io/product/performance/transaction-summary/)
* [Add Context for Node.js | Sentry Documentation](https://docs.sentry.io/platforms/node/enriching-events/context/)
* [Breadcrumbs for Node.js | Sentry Documentation](https://docs.sentry.io/platforms/node/enriching-events/breadcrumbs/)
* [Source Maps for Node.js | Sentry Documentation](https://docs.sentry.io/platforms/node/sourcemaps/)
* [TypeScript for Node.js | Sentry Documentation](https://docs.sentry.io/platforms/node/typescript/)
* [Integrations for Node.js | Sentry Documentation](https://docs.sentry.io/platforms/node/configuration/integrations/)
* [Performance Monitoring for Node.js | Sentry Documentation](https://docs.sentry.io/platforms/node/performance/)


# Old topics
## GPS
Took 75 seconds to get

    {
        "appId":"GPS",
        "data":"$GPGGA,163438.54,4647.00963,N,00708.37550,E,2,05,5.77,513.42,M,0,,*2E\r\n",
        "messageType":"DATA",
        "ts":1604248478086
    }

[Source](http://194.19.86.155/nRF_Connect_SDK/doc/latest/nrf/applications/asset_tracker/README.html#:~:text=Press%20Button%201%20(SW3%20on%20Thingy%3A91)%20for%20a,seconds%20to%20enable%20GPS%20tracking.)

[Compute distance](https://www.movable-type.co.uk/scripts/latlong.html)
