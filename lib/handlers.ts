import { NowRequest, NowResponse } from '@now/node';
import { text } from 'micro';
import { parse } from 'querystring';
import axios from 'axios';

import convert, { charSets } from './convert';

const slackBotUserOauthToken = process.env.SLACK_BOT_USER_OAUTH_TOKEN as string;

export const handler = (type: keyof typeof charSets) =>
  (req: NowRequest, res: NowResponse) =>
    res.send(
      convert(req.query.q as string, type),
    );

export const slackHandler = (type: keyof typeof charSets) =>
  async (req: NowRequest, res: NowResponse) => {
    const payload = parse(await text(req)) as SlackPayload;
    const convertedText = convert(payload.text as string, type);

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${slackBotUserOauthToken}`
    };

    const body = {
      channel: payload.channel_id,
      text: convertedText,
      as_user: true,
    };

    console.log(`Posting "${convertedText}" to slack...`);
    console.log(`Channel ID: ${payload.channel_id}`);
    await axios.post('https://slack.com/api/chat.postMessage', body, { headers });

    res.status(200).send('');
  }

// https://api.slack.com/interactivity/slash-commands#app_command_handling
type SlackPayload = {
  command: string,
  text: string,
  user_name: string,
  channel_id: string,
};
