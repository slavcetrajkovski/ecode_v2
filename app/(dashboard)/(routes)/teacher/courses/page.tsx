import { auth } from "@clerk/nextjs/server";
import { columns } from "./_components/Columns";
import { DataTable } from "./_components/DataTable";
import { redirect } from "next/navigation";
import { database } from "@/lib/database";

const CoursesPage = async () => {
  const { userId } = auth();

  if(!userId) {
    return redirect("/")
  }

  const courses = await database.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
