import { redirect } from "next/navigation";

import { getAnalytics } from "@/actions/get-analytics";
import { auth } from "@clerk/nextjs/server";
import { DataCard } from "./_components/DataCard";
import { Chart } from "./_components/Chart";

const AnalyticsPage = async () => {
  const { userId } = auth();

  if (!userId) return redirect("/");

  const { data, totalRevenue, totalSales } = await getAnalytics(userId);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard label="Вкупен приход" value={totalRevenue} shouldFormat />
        <DataCard label="Вкупна продажба" value={totalSales} />
      </div>
      <Chart data={data} />
    </div>
  );
};

export default AnalyticsPage;
