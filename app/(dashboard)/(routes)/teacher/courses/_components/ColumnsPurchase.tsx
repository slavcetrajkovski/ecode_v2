"use client";

import { Button } from "@/components/ui/button";
import { Course, Purchase } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const onUpdate = async (purchaseId: string, isPurchasedConfirmed: boolean) => {
  try {
    const response = await axios.patch(`/api/purchase/${purchaseId}`, {
      isPurchasedConfirmed,
    });

    if (response.status !== 200) throw new Error("Failed to update status");

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const columnsPurchase: ColumnDef<Purchase & { course: Course }>[] = [
  {
    accessorKey: "userEmailAddress",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Студент
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorFn: (row) => row.course.title,
    id: "courseTitle",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Курс
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "course.price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Цена
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = row.original.course.price;
      const formatted = formatPrice(price!);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "isPurchasedConfirmed",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Платено
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const purchaseId = row.original.id;
      let initialStatus: boolean =
        row.getValue("isPurchasedConfirmed") || false;
      const [isConfirmed, setIsConfirmed] = useState(initialStatus);
      const router = useRouter();

      const handleToggle = async (checked: boolean) => {
        const updatedPurchase = await onUpdate(purchaseId, checked);
        if (updatedPurchase) {
          setIsConfirmed(checked);
          toast.success("Успешно променет статус на уплата");
          router.refresh();
        } else {
          toast.error("Грешка при промена на статус на уплата");
        }
      };

      return (
        <Checkbox
          checked={isConfirmed}
          onCheckedChange={handleToggle}
          aria-label="Confirm Purchase Status"
        />
      );
    },
  },
];
