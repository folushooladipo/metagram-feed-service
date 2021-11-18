/* TODO: Wrap all sequelize.someCall() functions in a try+catch or a then+catch. In all catches:
- Use console.error(<MSG_UNIQUE_TO_FUNCTION>, error).
- returning 500 statuses and a generic error message e.g "Internal server error".
*/
import {JwtPayload} from "jsonwebtoken"
import {Router} from "express"

import {FeedItem, FeedItemAttributes} from "../models/FeedItem"
import {RequestWithTokenPayload, requireAuth} from "../../../../middleware"
import {getGetSignedUrl, getPutSignedUrl} from "../../../../aws"

const router: Router = Router()

interface FeedItemWithURL extends FeedItemAttributes {
  url: string
}

router.get("/", requireAuth, async (req: RequestWithTokenPayload, res) => {
  const {id: userId} = req.tokenPayload as JwtPayload
  const itemsData = await FeedItem.findAndCountAll({
    where: {userId},
    order: [["id", "DESC"]],
  })
  const itemsWithSignedGetUrls = itemsData.rows.map((item): FeedItemWithURL => {
    return {
      ...item.get({plain: true}),
      url: getGetSignedUrl(item.fileName),
    }
  })
  res.json({
    count: itemsData.count,
    rows: itemsWithSignedGetUrls,
  })
})

/* To see why I made fileName optional, make it required and see how the handler
for GET /feed/:id gets called instead of this one when a request like
GET /feed/signed-url/<NOTHING> is made. And this handler is defined before that one,
so reordering handlers didn't help.
*/
router.get("/signed-url/:fileName?", requireAuth, (req: RequestWithTokenPayload, res) => {
  const {fileName} = req.params
  if (!fileName) {
    return res.status(400).json({
      error: "Please specify the filename that you need a URL for.",
    })
  }

  const url = getPutSignedUrl(fileName)
  res.status(201).json({url})
})

router.get("/:id", requireAuth, async (req: RequestWithTokenPayload, res) => {
  const {id} = req.params
  if (!id) {
    return res.status(400).json({
      error: "Specify the ID of the feed item that you want.",
    })
  }

  if (Number.isNaN(Number(id))) {
    return res.status(400).json({
      error: "Specify a numeric value for the ID of the feed item that you want.",
    })
  }

  const {id: userId} = req.tokenPayload as JwtPayload
  const item = await FeedItem.findOne({where: {id, userId}})
  if (!item) {
    return res.status(404)
      .json({error: "Feed item not found."})
  }

  const itemWithUrl: FeedItemWithURL = {
    ...item.get({plain: true}),
    url: getGetSignedUrl(item.fileName),
  }
  res.json(itemWithUrl)
})

router.patch("/:id", requireAuth, async (req: RequestWithTokenPayload, res) => {
  const {caption, fileName} = req.body
  if (!caption && !fileName) {
    return res.status(400)
      .json({
        error: "File name or caption must be specified.",
      })
  }

  const {id} = req.params
  const {id: userId} = req.tokenPayload as JwtPayload
  const [numberOfUpdatedRecords, updatedRecords] = await FeedItem.update(
    {
      caption,
      fileName,
    },
    {
      where: {id, userId},
      returning: true,
    }
  )

  if (numberOfUpdatedRecords === 0) {
    return res.status(404)
      .json({
        error: `No record found with ID #${id}.`,
      })
  }

  const item = updatedRecords[0]
  const itemWithUrl: FeedItemWithURL = {
    ...item.get({plain: true}),
    url: getGetSignedUrl(item.fileName),
  }
  res.status(200)
    .json(itemWithUrl)
})

router.post("/", requireAuth, async (req: RequestWithTokenPayload, res) => {
  const {caption, fileName} = req.body

  if (!caption) {
    return res.status(400).json({error: "Caption is required."})
  }

  if (!fileName) {
    return res.status(400).json({error: "File name is required."})
  }

  const {id: userId} = req.tokenPayload as JwtPayload
  const item = new FeedItem({caption, fileName, userId: userId})

  const savedItem = await item.save()
  const savedItemWithUrl: FeedItemWithURL = {
    ...item.get({plain: true}),
    url: getGetSignedUrl(savedItem.fileName),
  }

  res.status(201).json(savedItemWithUrl)
})

export const FeedRouter: Router = router
