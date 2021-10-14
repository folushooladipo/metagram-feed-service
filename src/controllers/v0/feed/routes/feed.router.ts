import {Router} from "express"

import {getGetSignedUrl, getPutSignedUrl} from "../../../../aws"
import {FeedItem} from "../models/FeedItem"
import {requireAuth} from "../../../../middleware"

const router: Router = Router()

router.get("/", async (req, res) => {
  const itemsData = await FeedItem.findAndCountAll({order: [["id", "DESC"]]})
  const itemsWithSignedGetUrls = itemsData.rows.map((item) => {
    item.url = getGetSignedUrl(item.url)
    return item
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
router.get("/signed-url/:fileName?", requireAuth, (req, res) => {
  const {fileName} = req.params
  if (!fileName) {
    return res.status(400).json({
      error: "Please specify the filename that you need a URL for.",
    })
  }

  const url = getPutSignedUrl(fileName)
  res.status(201).json({url})
})

router.get("/:id", async (req, res) => {
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

  const item = await FeedItem.findByPk(id)
  if (!item) {
    return res.status(400)
      .json({error: "Feed item not found."})
  }

  item.url = getGetSignedUrl(item.url)
  res.json(item)
})

router.patch("/:id", requireAuth, async (req, res) => {
  const {caption, fileName} = req.body
  if (!caption && !fileName) {
    return res.status(400)
      .json({
        error: "File name or caption must be specified.",
      })
  }

  const {id} = req.params
  const [numberOfUpdatedRecords, updatedRecords] = await FeedItem.update(
    {
      caption,
      url: fileName,
    },
    {
      where: {id},
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
  item.url = getGetSignedUrl(item.url)
  res.status(200)
    .json(item)
})

// Post meta data and the filename after a file is uploaded
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post("/", requireAuth, async (req, res) => {
  const {caption, fileName} = req.body

  if (!caption) {
    return res.status(400).json({error: "Caption is required."})
  }

  if (!fileName) {
    return res.status(400).json({error: "File name is required."})
  }

  // @TODO:
  // - Use a migration to rename the FeedItem.url column to FeedItem.fileName. Use
  // this as a guide:
  // https://sequelize.org/master/manual/migrations.html
  // - Modify all code in this app to use fileName as well.
  const item = new FeedItem({
    caption: caption,
    url: fileName,
  })

  const savedItem = await item.save()

  savedItem.url = getGetSignedUrl(savedItem.url)
  res.status(201).json(savedItem)
})

export const FeedRouter: Router = router
