export abstract class Service {
  constructor() {}

  abstract execute(...paarms: any[]): Promise<unknown>
}
