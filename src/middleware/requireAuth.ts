import {NextFunction, Request, Response} from "express"
import superagent from "superagent"

import {config} from "../config/config"

const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.headers || !req.headers.authorization) {
    res.status(400).json({error: "No authorization headers were supplied."})
    return
  }

  const bearer = req.headers.authorization
  if (bearer.split(" ").length !== 2) {
    res.status(400).json({error: "Malformed token."})
    return
  }

  superagent
    .get(config.authEndpoint)
    .set({Authorization: bearer})
    .then(() => next())
    .catch((err) => {
      console.error("Failed to authenticate request because of the following error:\n", err)
      res.status(500).json({auth: false, error: "Failed to authenticate."})
    })
}

export default requireAuth
