import express from 'express';
const router = express.Router();

/* GET home page. */
router.get("/", function (req: any, res: any) {
  res.render("index", { title: "Express" });
});

export { router as indexRouter };
