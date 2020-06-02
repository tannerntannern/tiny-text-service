import { NowRequest, NowResponse } from '@now/node';
import convert, { charSets } from './convert';

export const handler = (type: keyof typeof charSets) =>
  (req: NowRequest, res: NowResponse) =>
    res.send(
      convert(req.query.q as string, type),
    );

export const slackHandler = (type: keyof typeof charSets) =>
  (req: NowRequest, res: NowResponse) =>
    res.json({
      response_type: 'in_channel',
      text: convert(req.query.text as string, type),
    });
