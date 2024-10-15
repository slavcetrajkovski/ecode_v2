import { database } from "@/lib/database";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await database.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    const purchase = await database.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (purchase) return new NextResponse("Already purchased", { status: 400 });

    if (!course) return new NextResponse("Not found", { status: 404 });

    const createdPurchase = await database.purchase.create({
      data: {
        courseId: params.courseId,
        userId: user.id,
        userEmailAddress: user.emailAddresses?.[0]?.emailAddress,
      },
    });

    if (createdPurchase) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "emergencycodesp@gmail.com",
          pass: "ljmk jdun ltva foyy",
        },
      });

      const mailOption = {
        from: "emergencycodesp@gmail.com",
        to: createdPurchase.userEmailAddress,
        subject: "Test Bato",
        html: `<h3>Hello BATICE</h3>`,
      };

      await transporter.sendMail(mailOption);
    }

    return NextResponse.json(createdPurchase);
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
