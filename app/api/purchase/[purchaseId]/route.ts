import { database } from "@/lib/database";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { purchaseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { isPurchasedConfirmed } = await req.json();

    const updatedPurchase = await database.purchase.update({
      where: {
        id: params.purchaseId,
      },
      data: {
        isPurchasedConfirmed,
      },
    });

    return NextResponse.json(updatedPurchase);
  } catch (error) {
    console.log("[PURCHASE_TOGGLE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
