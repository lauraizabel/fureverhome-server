import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { HereGetResponse } from 'src/address/interfaces/address-response.interface';
import { environment } from 'src/core/consts/environment.const';

const HereApi = 'https://geocode.search.hereapi.com/v1/geocode';

const buildHereApiUrl = (address: string) => {
  const params = new URLSearchParams({
    q: address,
    apiKey: environment.here.apiKey,
  });

  return `${HereApi}?${params.toString()}`;
};

@Injectable()
export class AddressService {
  async getCoordinatesByAddress(address: string) {
    const url = buildHereApiUrl(address);
    const response = await axios.get<HereGetResponse>(url);
    const { items } = response.data;

    if (!items.length) {
      throw new Error('Address not found');
    }

    const { position } = items[0];

    return position;
  }
}
