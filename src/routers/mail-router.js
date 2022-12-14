import express from 'express';
import { asyncHandler } from '../utils/async-handler';
import { mailService } from '../services';
const sendMailRouter = express.Router();
sendMailRouter.post(
  '/send-mail',
  asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      res
        .status(400)
        .json('req.body.email undefined, 이메일을 요청 바디에 적어주세요');
      return;
    }
    const user = await mailService.findUserByEmail(email);

    const password = await mailService.setRandomPassword(user);
    const ip =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress ||
      req.ip;

    const info = await mailService.sendPasswordFindMail(email, password, ip);
    res.status(201).json({ msg: '메일이 발송되었습니다.', info });
  }),
);

sendMailRouter.post(
  '/send-mail/dormant',
  asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      res
        .status(400)
        .json('req.body.email undefined, 이메일을 요청 바디에 적어주세요');
      return;
    }
    const user = await mailService.findUserByEmail(email);
    const ip =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress ||
      req.ip;
    const info = await mailService.sendDormantAccountMail(email, ip);

    res.status(201).json({ msg: '메일이 발송되었습니다.', info });
  }),
);

// sendMailRouter.get(
//   '/login',
//   asyncHandler(async (req, res, next) => {
//     const { email } = req.query;
//     await mailService.recoverDormantAccount(email);
//     next()
//   }),
// );

export { sendMailRouter };
