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
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOption = {
        from: process.env.NEXT_PUBLIC_EMAIL,
        to: createdPurchase.userEmailAddress,
        subject: "Потврда за апликација",
        html: `
          <div style="background-color: #f9fafb; padding: 20px; font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
              <!-- Header -->
              <div style="background-color: #e38a97; padding: 20px; text-align: center;">
                <h2 style="color: #ffffff; font-size: 24px; font-weight: bold;">Ви благодариме за апликацијата!</h2>
              </div>
              <!-- Body -->
              <div style="padding: 20px; text-align: left;">
                <h3 style="color: #1f2937; font-size: 20px; font-weight: bold;">Здраво ${
                  user.emailAddresses?.[0]?.emailAddress || "почитувани"
                },</h3>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                  Ви благодариме што се пријавивте на курсот <strong>${
                    course.title
                  }</strong>. За да добиете пристап до материјалите, 
                  потребно е да го извршите уплата според долунаведените информации.
                </p>
      
                <h4 style="color: #1f2937; font-size: 18px; font-weight: bold; margin-top: 20px;">Податоци за уплата:</h4>
                <ul style="color: #4b5563; font-size: 16px; list-style-type: none; padding-left: 0;">
                  <li><strong>Име и презиме:</strong> ${
                    process.env.BANK_NAME
                  }</li>
                  <li><strong>Банка:</strong> NLB Banka</li>
                  <li><strong>Број на сметка:</strong> ${process.env.BANK}</li>
                  <li><strong>Цел на дознака:</strong> Останати плаќања</li>
                </ul>
      
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-top: 20px;">
                  Откако ќе го извршите уплаќањето, ве молиме да одговорите на овој е-маил како потврда или да не контактирате на нашиот Инстаграм профил.
                </p>
      
                <a href="https://www.instagram.com/ecode.mk" 
                   style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #e38a97; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px;">
                  Контактирајте не на Instagram
                </a>
      
                <p style="color: #9ca3af; font-size: 14px; margin-top: 20px;">
                  Доколку имате дополнителни прашања, слободно обратете ни се.
                </p>
              </div>
              <!-- Footer -->
              <div style="background-color: #f3f4f6; padding: 10px 20px; text-align: center;">
                <p style="color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} eCode MK. Сите права се задржани.</p>
              </div>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOption);
    }

    return NextResponse.json(createdPurchase);
  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
