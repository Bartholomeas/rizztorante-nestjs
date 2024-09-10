import { Injectable } from "@nestjs/common";

@Injectable()
export class UploadsService {
  private;

  constructor() {}

  async getFile(id: string) {
    return { id };
  }

  async uploadFile() {
    return {};
  }
}
