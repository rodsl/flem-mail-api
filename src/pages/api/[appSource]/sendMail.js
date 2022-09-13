// pages/api/hello.js
import { sendMail } from "controllers";
import nc from "next-connect";

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
      const response = await sendMail(appSource, req.body);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json(JSON.stringify(error));
    }
  })
  .patch(async (req, res) => {
    throw new Error("Throws me around! Error can be caught and handled.");
  });
