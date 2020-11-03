import SubX from 'subx';
import {TokenInfo} from '@rc-ex/core/lib/definitions';
import RingCentral from '@rc-ex/core';
import AuthorizeUriExtension from '@rc-ex/authorize-uri';
import localforage from 'localforage';
import {message} from 'antd';

const redirectUri = window.location.origin + window.location.pathname;
const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
});
const urlSearchParams = new URLSearchParams(
  new URL(window.location.href).search
);
const code = urlSearchParams.get('code');
export let authorizeUri = '';
if (code === null) {
  const authorizeUriExtension = new AuthorizeUriExtension();
  rc.installExtension(authorizeUriExtension);
  authorizeUri = authorizeUriExtension.buildUri({
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
  });
  const codeVerifier = authorizeUriExtension.codeVerifier;
  localforage.setItem('code_verifier', codeVerifier);
}

export type StoreType = {
  ready: boolean;
  token?: TokenInfo;
  init: Function;
  sendMms: Function;
};

const store = SubX.proxy<StoreType>({
  ready: false,
  async init() {
    if (code !== null) {
      this.token = await rc.authorize({
        code,
        redirect_uri: redirectUri,
        code_verifier: (await localforage.getItem('code_verifier')) as string,
      });
      console.log(JSON.stringify(this.token, null, 2));
    }
  },
  async sendMms(state: {toNumber: string; messageBody: string}) {
    const file = (document.getElementById('imageFile') as HTMLInputElement)
      .files![0];
    const phoneNumbers = await rc
      .restapi()
      .account()
      .extension()
      .phoneNumber()
      .get({usageType: ['DirectNumber'], status: 'Normal'});
    const fromNumbers = phoneNumbers.records!.filter(pn =>
      pn.features?.includes('MmsSender')
    );
    if (fromNumbers.length === 0) {
      message.error('You have no number which can send MMS');
      return;
    }
    try {
      await rc
        .restapi()
        .account()
        .extension()
        .mms()
        .post({
          from: {phoneNumber: fromNumbers[0].phoneNumber},
          to: [{phoneNumber: state.toNumber}],
          text: state.messageBody,
          attachments: [
            {
              filename: file.name,
              contentType: `image/${
                file.name.endsWith('.png') ? 'png' : 'jpeg'
              }`,
              content: file,
            },
          ],
        });
      message.success('MMS message has been sent')!;
    } catch (e) {
      message.error(e.toString(), 0);
    }
  },
});

export default store;
