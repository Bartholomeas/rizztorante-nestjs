import { Currency } from "@common/types/currency.type";

export class PaymentDetailsDto {
  public paymentUrl?: string;
  public cancelUrl?: string;
  public method?: string;
  public paidAmount?: number;
  public expiresAt?: Date;
  public discounts?: unknown[];
  public currency?: Currency = Currency.PLN;

  constructor(partial: Partial<PaymentDetailsDto> = {}) {
    Object.assign(this, partial);
  }
}
