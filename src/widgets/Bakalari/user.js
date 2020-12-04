class User {
  constructor (username, password, server) {
    this.server = server;

    this.accessToken = null;
    this.refreshToken = null;
    this.onReadyListener = () => null;
    this.getToken(username, password).then(() => this.onReadyListener());
  }

  async auth (data) {
    const url = `${this.server}/api/login`;
    const body = User.toURLEncoded(data);
    const options = {
      url,
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${this.accessToken}`
      }
    };

    const request = require('request-promise-native');
    const response = await request(options);
    return JSON.parse(response);
  }

  async getToken (username, password) {
    let response = null;

    if (this.refreshToken == null) {
      response = await this.auth({ client_id: 'ANDR', grant_type: 'password', username, password });
    } else {
      response = await this.auth({ client_id: 'ANDR', grant_type: 'refresh_token', refresh_token: this.refreshToken });
    }

    this.accessToken = response.access_token;
    this.refreshToken = response.refresh_token;
    setTimeout(this.getToken.bind(this), response.expires_in * 1000);
  }

  static toURLEncoded (object) {
    let output = '';

    for (const key in object) {
      output += `${key}=${object[key]}&`;
    }

    return output;
  }

  async getData (endpoint, options) {
    if (this.accessToken) {
      const uri = `${this.server}/api/3/${endpoint}`;
      const parameters = User.toURLEncoded(options);
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${this.accessToken}`
        }
      };
      const request = require('request-promise-native');
      const response = await request(`${uri}?${parameters}`, requestOptions);
      // console.log(response);
      return JSON.parse(response);
    }
  }

  onReady (f) {
    this.onReadyListener = f;
    return this;
  }
}

User.endpoints = {
  ACTUAL_TIMETABLE: 'timetable/actual',
  USER: 'user',
  MARKS: 'marks'
};

export default User;
