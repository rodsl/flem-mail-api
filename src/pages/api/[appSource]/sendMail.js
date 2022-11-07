import nc from "next-connect";
import { sendMailPortal_PPE } from "controllers/sendMailControllers";

export default nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(405).json("Method Not Allowed");
  },
})
  .post(async (req, res) => {
    const { appSource } = req.query;
    try {
      switch (appSource) {
        case "Portal_PPE":
          const response = await sendMailPortal_PPE(appSource, req.body);
          res.status(200).json(response);
          break;

        default:
          res.status(405).json("Method Not Allowed");
          break;
      }
    } catch (error) {
      res.status(500).json(JSON.stringify(error));
    }
  })
