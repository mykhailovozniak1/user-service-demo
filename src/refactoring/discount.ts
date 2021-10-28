export interface IUserDetails {
  isPremium: boolean;
  isVIP: boolean;
  isFamily: boolean;
  isUnsupported: boolean;
  children: number;
  ordersCount: number;
}

export interface IDiscount {
  getDiscountAmount(userDetails: IUserDetails): IDiscountDetails;
}

export enum DiscountEnumLabel {
  vip = 'vip',
  premium = 'premium',
  family = 'family',
  unsupported = 'unsupported',
  none = 'none'
}

export interface IDiscountDetails {
  discountAmount: number;
  type: string;
}

//TODO: Code that will be refactored
export class DiscountRefactored2 implements IDiscount {
  getDiscountAmount(userDetails: IUserDetails): IDiscountDetails {
    if (this.isEligibleForVIPDiscount(userDetails)) {
      return { discountAmount: 20, type: DiscountEnumLabel.vip };
    }

    if (this.isEligibleForPremiumDiscount(userDetails)) {
      return { discountAmount: 15, type: DiscountEnumLabel.premium };
    }

    if (this.isEligibleForFamilyDiscount(userDetails)) {
      return { discountAmount: 15, type: DiscountEnumLabel.family };
    }

    if (this.isEligibleForUnsupportedDiscount(userDetails)) {
      return { discountAmount: 12, type: DiscountEnumLabel.unsupported };
    }

    return { discountAmount: 0, type: DiscountEnumLabel.none };
  }

  private isEligibleForVIPDiscount(userDetails) {
    return userDetails.isVIP && userDetails.ordersCount > 100;
  }

  private isEligibleForPremiumDiscount(userDetails) {
    return userDetails.isPremium && userDetails.ordersCount > 80;
  }

  private isEligibleForFamilyDiscount(userDetails) {
    return userDetails.isFamily &&
      userDetails.children >= 2 &&
      userDetails.ordersCount > 30;
  }

  private isEligibleForUnsupportedDiscount(userDetails) {
    return userDetails.isUnsupported && userDetails.ordersCount > 50;
  }
}

//TODO #1 Replace Nested Conditional with Guard Clauses
export class DiscountRefactored1 implements IDiscount {
  getDiscountAmount(userDetails: IUserDetails): IDiscountDetails {
    if (userDetails.isVIP && userDetails.ordersCount > 100) {
      return { discountAmount: 20, type: DiscountEnumLabel.vip };
    }

    if (userDetails.isPremium && userDetails.ordersCount > 80) {
      return { discountAmount: 15, type: DiscountEnumLabel.premium };
    }

    if (userDetails.isFamily && userDetails.children >= 2 && userDetails.ordersCount > 30) {
      return { discountAmount: 15, type: DiscountEnumLabel.family };
    }

    if (userDetails.isUnsupported && userDetails.ordersCount > 50) {
      return { discountAmount: 12, type: DiscountEnumLabel.unsupported };
    }

    return { discountAmount: 0, type: DiscountEnumLabel.none };
  }
}

//TODO: #2 Consolidate Conditional Expression
export class DiscountRefactored2 implements IDiscount {
  getDiscountAmount(userDetails: IUserDetails): IDiscountDetails {
    if (this.isEligibleForVIPDiscount(userDetails)) {
      return { discountAmount: 20, type: DiscountEnumLabel.vip };
    }

    if (this.isEligibleForPremiumDiscount(userDetails)) {
      return { discountAmount: 15, type: DiscountEnumLabel.premium };
    }

    if (this.isEligibleForFamilyDiscount(userDetails)) {
      return { discountAmount: 15, type: DiscountEnumLabel.family };
    }

    if (this.isEligibleForUnsupportedDiscount(userDetails)) {
      return { discountAmount: 12, type: DiscountEnumLabel.unsupported };
    }

    return { discountAmount: 0, type: DiscountEnumLabel.none };
  }

  private isEligibleForVIPDiscount(userDetails) {
    return userDetails.isVIP && userDetails.ordersCount > 100;
  }

  private isEligibleForPremiumDiscount(userDetails) {
    return userDetails.isPremium && userDetails.ordersCount > 80;
  }

  private isEligibleForFamilyDiscount(userDetails) {
    return userDetails.isFamily &&
      userDetails.children >= 2 &&
      userDetails.ordersCount > 30;
  }

  private isEligibleForUnsupportedDiscount(userDetails) {
    return userDetails.isUnsupported && userDetails.ordersCount > 50;
  }
}

//TODO: #3 Replace Magic Literal (formerly:	Replace Magic Number with Symbolic Constant)
export const VIP_DISCOUNT_AMOUNT = 20;
export const PREMIUM_DISCOUNT_AMOUNT = 15;
export const FAMILY_DISCOUNT_AMOUNT = 10;

export const VIP_ORDERS_COUNT = 100;
export const PREMIUM_ORDERS_COUNT = 80;
export const FAMILY_ORDERS_COUNT = 30;
export const FAMILY_CHILDREN_COUNT = 2;
export const UNSUPPORTED_ORDERS_COUNT = 50;

export class DiscountRefactored3 implements IDiscount {
  getDiscountAmount(userDetails: IUserDetails): IDiscountDetails {
    if (this.isEligibleForVIPDiscount(userDetails)) {
      return { discountAmount: VIP_DISCOUNT_AMOUNT, type: DiscountEnumLabel.vip };
    }

    if (this.isEligibleForPremiumDiscount(userDetails)) {
      return { discountAmount: PREMIUM_DISCOUNT_AMOUNT, type: DiscountEnumLabel.premium };
    }

    if (this.isEligibleForFamilyDiscount(userDetails)) {
      return { discountAmount: FAMILY_DISCOUNT_AMOUNT, type: DiscountEnumLabel.family };
    }

    if (this.isEligibleForUnsupportedDiscount(userDetails)) {
      return { discountAmount: UNSUPPORTED_ORDERS_COUNT, type: DiscountEnumLabel.unsupported };
    }

    return { discountAmount: 0, type: DiscountEnumLabel.none };
  }

  private isEligibleForVIPDiscount(userDetails) {
    return userDetails.isVIP && userDetails.ordersCount > VIP_ORDERS_COUNT;
  }

  private isEligibleForPremiumDiscount(userDetails) {
    return userDetails.isPremium && userDetails.ordersCount > PREMIUM_ORDERS_COUNT;
  }

  private isEligibleForFamilyDiscount(userDetails) {
    return userDetails.isFamily &&
      userDetails.children >= FAMILY_CHILDREN_COUNT &&
      userDetails.ordersCount > FAMILY_ORDERS_COUNT;
  }

  private isEligibleForUnsupportedDiscount(userDetails) {
    return userDetails.isUnsupported && userDetails.ordersCount > UNSUPPORTED_ORDERS_COUNT;
  }
}

//TODO: #4 Remove Dead Code
export class DiscountRefactored4 implements IDiscount {
  getDiscountAmount(userDetails: IUserDetails): IDiscountDetails {
    if (this.isEligibleForVIPDiscount(userDetails)) {
      return { discountAmount: VIP_DISCOUNT_AMOUNT, type: DiscountEnumLabel.vip };
    }

    if (this.isEligibleForPremiumDiscount(userDetails)) {
      return { discountAmount: PREMIUM_DISCOUNT_AMOUNT, type: DiscountEnumLabel.premium };
    }

    if (this.isEligibleForFamilyDiscount(userDetails)) {
      return { discountAmount: FAMILY_DISCOUNT_AMOUNT, type: DiscountEnumLabel.family };
    }

    return { discountAmount: 0, type: DiscountEnumLabel.none };
  }

  private isEligibleForVIPDiscount(userDetails) {
    return userDetails.isVIP && userDetails.ordersCount > VIP_ORDERS_COUNT;
  }

  private isEligibleForPremiumDiscount(userDetails) {
    return userDetails.isPremium && userDetails.ordersCount > PREMIUM_ORDERS_COUNT;
  }

  private isEligibleForFamilyDiscount(userDetails) {
    return userDetails.isFamily &&
      userDetails.children >= FAMILY_CHILDREN_COUNT &&
      userDetails.ordersCount > FAMILY_ORDERS_COUNT;
  }
}

//TODO: #5 Remove Duplicated Code and move to reusable component
//TODO: #5 src/users/users.controller.ts lines 70, 93, 104
