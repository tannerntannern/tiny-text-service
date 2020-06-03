import { NowRequest, NowResponse } from '@now/node';
import { text } from 'micro';
import { parse } from 'querystring';
import axios from 'axios';

import convert, { charSets } from './convert';

const slackApiBaseUrl = process.env.SLACK_API_BASE_URL as string;
const slackBotUserOauthToken = process.env.SLACK_BOT_USER_OAUTH_TOKEN as string;

export const handler = (type: keyof typeof charSets) =>
  (req: NowRequest, res: NowResponse) =>
    res.send(
      convert(req.query.q as string, type),
    );

export const slackHandler = (type: keyof typeof charSets) =>
  async (req: NowRequest, res: NowResponse) => {
    const payload = parse(await text(req)) as SlashCommandPayload;
    const convertedText = convert(payload.text as string, type);

    res.json({
      response_type: 'ephemeral',
      text: convertedText,
    })

    // const headers = {
    //   'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${slackBotUserOauthToken}`
    // };

    // const body = {
    //   channel: payload.channel_id,
    //   text: convertedText,
    // };

    // const response = await axios.post<PostMessageResponse>(`${slackApiBaseUrl}/chat.postMessage`, body, { headers });
    // if (!response.data.ok) {
    //   console.log(JSON.stringify(response.data));
    //   res.json({
    //     response_type: 'ephemeral',
    //     text: response.data.error,
    //   });
    // } else {
    //   res.send('');
    // }
  }

// https://api.slack.com/interactivity/slash-commands#app_command_handling
type SlashCommandPayload = {
  command: string,
  text: string,
  user_name: string,
  channel_id: string,
};

type PostMessageResponse = {
  ok: boolean,
  error?: string,
} & { [x: string]: any };
