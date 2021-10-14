import {Router} from "express"

import {FeedRouter} from "./feed/routes/feed.router"

const router: Router = Router()

/* =>> Delete after December 2021 <==
Can I outsource all authentication to the reverse proxy? An alternative
is to add the requireAuth middleware to every service but it will be hard to keep the
middleware's contents in sync across multiple services. The challenge with outsourcing
auth to the reverse proxy is how do I make it pass through the requests that need no
auth e.g POST /login without editing the reverse proxy every time a new service/route
is created (which negates our desire to only have to work on one microservice in order
to build features)?
UPDATE: I might have no other choice than to send the token to the user/auth service
for verification. The URL to the auth service should be stored in an env var though.
*/
router.use("/feed", FeedRouter)

export const IndexRouter: Router = router
