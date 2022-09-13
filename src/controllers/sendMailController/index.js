import { mailTransporter, prisma } from "services";
export const sendMail = async (appSource, data) => {
  const mailsToCatalog = new Array().concat(
    ...data.map(({ contatos, ...mail }) =>
      contatos.map((cont) => ({ ...mail, ...cont }))
    )
  );

  // console.log(mailsToCatalog);

  const catalogMailsOnBd = await prisma.$transaction(
    mailsToCatalog.map(({ contato, remetente, assunto, html, id, anexosId }) =>
      prisma.mails.create({
        data: {
          appSource,
          from: `${remetente.nome} <${remetente.email}>`,
          to: contato,
          content: html,
          subject: assunto,
          attachmentsId: anexosId,
          referenceObjId: id,
        },
      })
    )
  );
  console.log(catalogMailsOnBd);

  const mailStatus = await Promise.all(
    catalogMailsOnBd.map(({ id, to, from, subject, content: html }) =>
      mailTransporter.sendMail(
        {
          // to,
          to: "rodrigo.lima@frtechnologies.com.br",
          from: "codehub software house <oi@codehub.dev.br>",
          // from,
          subject,
          html,
          messageId: id,
          dsn: {
            id,
            return: "headers",
            notify: ["success", "failure", "delay"],
            recipient: "rodrigo.lima@codehub.dev.br",
          },
        },
        (err, info) => console.log(err, info)
      )
    )
  );

  return mailStatus;
};
