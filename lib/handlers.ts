import { NowRequest, NowResponse } from '@now/node';
import { text } from 'micro';
import { parse } from 'querystring';

import convert, { charSets } from './convert';

export const handler = (type: keyof typeof charSets) =>
  (req: NowRequest, res: NowResponse) =>
    res.send(
      convert(req.query.q as string, type),
    );

export const slackHandler = (type: keyof typeof charSets) =>
  async (req: NowRequest, res: NowResponse) =>
    res.json({
      response_type: 'in_channel',
      text: convert(
        parse(await text(req)).text as string,
        type,
      ),
    });
