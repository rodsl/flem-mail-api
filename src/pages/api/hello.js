// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { mailTransporter } from "services";

export default async function handler(req, res) {
  try {
    const emailLog = await mailTransporter.sendMail({
      to: "rodrigo.lima@frtechnologies.com.br",
      from: "codehub software house <oi@codehub.dev.br>",
      subject: "TESTE",
      text: "Teste nodemailer",
    });

    res.status(200).json(emailLog);
  } catch (error) {
    console.log(error);
  }
}
