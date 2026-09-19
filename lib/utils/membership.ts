import { Order, UserProfile } from "@/types";

export interface MembershipStatusInfo {
  orderCount: number;
  isValuedMember: boolean;
  qualifiesFor3OrderOffer: boolean;
  qualifiesFor5OrderAutoUpgrade: boolean;
  ordersUntilFreeUpgrade: number;
  membershipMethod?: "purchased" | "auto_5_orders";
}

/**
 * Calculates membership status, milestones, and qualifying perks based on user & order history
 */
export function calculateMembershipStatus(
  user: UserProfile | null,
  orders: Order[]
): MembershipStatusInfo {
  // Count user orders (matching user ID or email)
  const userOrders = orders.filter((o) => {
    if (!user) return false;
    const matchEmail = o.customerEmail?.toLowerCase() === user.email?.toLowerCase();
    const matchId = o.userId === user.id;
    return matchEmail || matchId;
  });

  const orderCount = userOrders.length;
  const isValuedMember = Boolean(user?.isValuedMember || user?.membershipTier === "valued_client" || orderCount >= 5);

  const qualifiesFor3OrderOffer = !isValuedMember && orderCount >= 3 && orderCount < 5;
  const qualifiesFor5OrderAutoUpgrade = orderCount >= 5;
  const ordersUntilFreeUpgrade = Math.max(0, 5 - orderCount);

  return {
    orderCount,
    isValuedMember,
    qualifiesFor3OrderOffer,
    qualifiesFor5OrderAutoUpgrade,
    ordersUntilFreeUpgrade,
    membershipMethod: isValuedMember
      ? user?.membershipMethod || (orderCount >= 5 ? "auto_5_orders" : "purchased")
      : undefined,
  };
}

/**
 * Sends a background request to deliver the milestone notification email
 */
export async function sendMembershipEmail(
  email: string,
  fullName: string,
  milestone: "offer_3_orders" | "auto_5_orders",
  orderCount: number
) {
  try {
    await fetch("/api/membership/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        fullName,
        milestone,
        orderCount,
      }),
    });
  } catch (err) {
    console.error("Failed to send membership email notification:", err);
  }
}
