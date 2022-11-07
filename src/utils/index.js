import { fileService } from "services/fileService";

export const getAnexos = async (appSource, fileId) => {
  const { data, headers } = await fileService.get(
    `/${appSource}/downloadFile`,
    {
      params: {
        fileId,
      },
      responseType: "arraybuffer",
    }
  );

  return {
    filename: decodeURI(headers.filename),
    content: data,
    contentType: headers["file-content-type"],
  };
};
