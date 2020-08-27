import SubX from 'subx';
import {TokenInfo} from '@rc-ex/core/lib/definitions';
import RingCentral from '@rc-ex/core';
import AuthorizeUriExtension from '@rc-ex/authorize-uri';

const redirectUri = window.location.origin + window.location.pathname;
const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
});
const authorizeUriExtension = new AuthorizeUriExtension();
rc.installExtension(authorizeUriExtension);
export const authorizeUri = authorizeUriExtension.buildUri({
  redirect_uri: redirectUri,
});

const urlSearchParams = new URLSearchParams(
  new URL(window.location.href).search
);
const code = urlSearchParams.get('code');

export type StoreType = {
  ready: boolean;
  token?: TokenInfo;
  init: Function;
};

const store = SubX.proxy<StoreType>({
  ready: false,
  async init() {
    if (code !== null) {
      this.token = await rc.authorize({
        code,
        redirect_uri: redirectUri,
      });
    }
  },
});

export default store;
