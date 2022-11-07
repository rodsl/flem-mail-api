import axiosClient from "axios";

export const fileService = axiosClient.create({
  baseURL: `${process.env.NEXT_API_FILE_UPLOAD}/api`,
  timeout: 30000,
});
