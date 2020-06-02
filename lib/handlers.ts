import { NowRequest, NowResponse } from '@now/node';
import convert, { charSets } from './convert';

export const handler = (type: keyof typeof charSets) =>
  (req: NowRequest, res: NowResponse) =>
    res.send(
      convert(req.query.q as string, type),
    );
