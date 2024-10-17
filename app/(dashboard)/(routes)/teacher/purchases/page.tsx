import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { database } from "@/lib/database";
import { DataTablePurchase } from "../courses/_components/DataTablePurchase";
import { columnsPurchase } from "../courses/_components/ColumnsPurchase";

const PurchasePage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const purchases = await database.purchase.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      course: true,
    },
  });

  return (
    <div className="p-6">
      <DataTablePurchase columns={columnsPurchase} data={purchases} />
    </div>
  );
};

export default PurchasePage;
