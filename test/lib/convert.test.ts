import { describe, it } from 'mocha';
import { expect } from 'earljs';

import convert, { charSets } from '../../lib/convert';

describe('convert(...)', () => {
    const testCases: [string, string, string, string][] = [
        ['tiny', 'ᵗⁱⁿʸ', 'ᴛɪɴʏ', 'ｔｉｎｙ'],
        [
            'the quick brown fox jumped over the lazy dog',
            'ᵗʰᵉ ᵠᵘⁱᶜᵏ ᵇʳᵒʷⁿ ᶠᵒˣ ʲᵘᵐᵖᵉᵈ ᵒᵛᵉʳ ᵗʰᵉ ˡᵃᶻʸ ᵈᵒᵍ',
            'ᴛʜᴇ qᴜɪᴄᴋ ʙʀᴏᴡɴ ꜰᴏx ᴊᴜᴍᴘᴇᴅ ᴏᴠᴇʀ ᴛʜᴇ ʟᴀᴢʏ ᴅᴏɢ',
            'ｔｈｅ ｑｕｉｃｋ ｂｒｏｗｎ ｆｏｘ ｊｕｍｐｅｄ ｏｖｅｒ ｔｈｅ ｌａｚｙ ｄｏｇ',
        ],
    ];

    for (const conversionType of (Object.keys(charSets) as (keyof typeof charSets)[])) {
        describe(`${conversionType} conversion`, () => {
            for (const [plain, tiny, smallCaps, wide] of testCases) {
                const converted = ({ tiny, smallCaps, wide })[conversionType];
                it(`"${plain}" → "${converted}"`, () => {
                    expect(convert(plain, conversionType)).toEqual(converted);
                });
            }
        });
    }
});
