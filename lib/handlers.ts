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
  async (req: NowRequest, res: NowResponse) => {
    const payload = parse(await text(req)) as SlashCommandPayload;
    const convertedText = convert(payload.text as string, type);

    console.log(payload.response_url.slice(0, 16));

    res.json({
      response_type: 'in_channel',
      text: convertedText,
    })
  }

// https://api.slack.com/interactivity/slash-commands#app_command_handling
type SlashCommandPayload = {
  command: string,
  text: string,
  user_name: string,
  channel_id: string,
  response_url: string,
};
