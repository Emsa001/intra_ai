import axios from "axios";

class IntraRequest {
  url: string;
  headers: object;

  constructor(headers: object | null) {
    this.url = "https://api.intra.42.fr";
    this.headers = headers || {};

    this.headers["Content-Type"] = "application/json";
    this.headers["Accept"] = "application/json";
  }

  async Authorization() {
    const response = await axios.post(`${this.url}/oauth/token`, {
      grant_type: "client_credentials",
      client_id: process.env.INTRA_UID,
      client_secret: process.env.INTRA_SECRET,
    });

    if (response.status !== 200 || !response?.data?.access_token)
      throw new Error("Failed to get token");

    return `Bearer ${response.data.access_token}`;
  }

  async get(endpoint, params) {
    try {
      const response = await axios.get(this.url + endpoint, {
        params,
        headers: { Authorization: await this.Authorization() },
      });
      return response.data;
    } catch (err) {
      return err;
    }
  }

  async post(endpoint, data) {
    try {
      const response = await axios.post(this.url + endpoint, data, {
        headers: { Authorization: await this.Authorization() },
      });
      return response.data;
    } catch (err) {
      return err;
    }
  }

  async put(endpoint, data) {
    try {
      const response = await axios.put(this.url + endpoint, data, {
        headers: { Authorization: await this.Authorization() },
      });
      return response.data;
    } catch (err) {
      return err;
    }
  }

  async delete(endpoint, data) {
    try {
      const response = await axios.delete(this.url + endpoint, {
        headers: { Authorization: await this.Authorization() },
      });
      return response.data;
    } catch (err) {
      return err;
    }
  }
}

export default IntraRequest;
