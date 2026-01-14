import { Order } from "@prisma/client";

export type CdekResponse = {
  trackCode: string;
  cdekOrderId: string;
};

export const cdekClient = {
  async createOrder(order: Order): Promise<CdekResponse> {
    const trackCode = `CDEK-${order.id.slice(0, 8).toUpperCase()}`;
    return {
      trackCode,
      cdekOrderId: `mock-${order.id}`
    };
  }
};
