import SubX from 'subx';
import {TokenInfo} from '@rc-ex/core/lib/definitions';
import RingCentral from '@rc-ex/core';
import AuthorizeUriExtension from '@rc-ex/authorize-uri';
// import localforage from 'localforage';
import axios from 'axios';
import qs from 'qs';

const redirectUri = window.location.origin + window.location.pathname;
const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
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
    // code_challenge_method: 'S256',
  });
  // const codeVerifier = authorizeUriExtension.codeVerifier;
  // localforage.setItem('code_verifier', codeVerifier);
}

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
        // code_verifier: (await localforage.getItem('code_verifier')) as string,
      });
      const r = await axios.post(
        process.env.RINGCENTRAL_SERVER_URL + '/restapi/oauth/token',
        qs.stringify({
          client_id: process.env.RINGCENTRAL_CLIENT_ID,
          refresh_token: rc.token!.refresh_token!,
          grant_type: 'refresh_token',
        })
      );
      console.log(r.data);
    }
  },
});

export default store;
