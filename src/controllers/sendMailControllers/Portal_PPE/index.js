import { mailTransporter, prisma } from "services";
import { getAnexos } from "utils";

export const sendMailPortal_PPE = async (appSource, data) => {
  const mailsToCatalog = new Array().concat(
    ...data.map(({ contatos, ...mail }) =>
      contatos.map((cont) => ({ ...mail, ...cont }))
    )
  );

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

  const mailStatus = await Promise.all(
    catalogMailsOnBd.map(
      async ({ id, to, from, subject, content: html, attachmentsId }) => {
        if (attachmentsId) {
          const parsedAttachments = JSON.parse(attachmentsId);
          const anexos = await Promise.all(
            parsedAttachments.map(({ id }) => getAnexos(appSource, id))
          );

          return mailTransporter.sendMail({
            to,
            from,
            subject,
            html,
            messageId: id,
            attachments: anexos,
          });
        }

        return mailTransporter.sendMail({
          to,
          from,
          subject,
          html,
          messageId: id,
        });
      }
    )
  );

  return mailStatus;
};
