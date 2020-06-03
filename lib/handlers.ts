import { NowRequest, NowResponse } from '@now/node';
import { text } from 'micro';
import { parse } from 'querystring';
import axios from 'axios';

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

    const headers = {
      'Content-Type': 'application/json',
    };

    const body = {
      text: convertedText,
      response_type: 'in_channel',
    };

    const response = await axios.post(payload.response_url, body, { headers });
    if (response.status !== 200) {
      console.log(JSON.stringify(response.data));
      res.json({
        response_type: 'ephemeral',
        text: 'Oops, we failed to process that command.',
      });
    } else {
      res.send('');
    }
  }

// https://api.slack.com/interactivity/slash-commands#app_command_handling
type SlashCommandPayload = {
  command: string,
  text: string,
  user_name: string,
  channel_id: string,
  response_url: string,
};
