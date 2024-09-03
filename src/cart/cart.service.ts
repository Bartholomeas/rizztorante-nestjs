import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { User } from "@/auth/entity/user.entity";
import { SessionEntity } from "@/auth/session/entity/session.entity";

import { Cart } from "./entity/cart.entity";

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUserCart(userId: string): Promise<Cart> {
    const userCart = await this.cartRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    console.log("cholibka::::::: ", userCart);
    if (userCart) return userCart;

    const currentUser = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    console.log("ALE JSUER:   ", currentUser, userId);
    const created = this.cartRepository.create({ user: currentUser, items: [{}] });

    return await this.cartRepository.save(created);
  }

  async createCartForUser(userId: string): Promise<Cart> {
    console.log({ userId });
    return {} as Cart;
  }

  async clearCart(cartId: string): Promise<void> {
    await this.cartRepository.delete(cartId);
  }
}
