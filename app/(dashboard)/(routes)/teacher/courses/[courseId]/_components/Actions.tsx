"use client";

import ConfirmModal from "@/components/modals/ConfirmModal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onPublish = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("Курсот е успешно поставен приватен");
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("Курсот е успешно публикуван");
        confetti.onOpen();
      }

      router.refresh();
    } catch {
      toast.error("Грешка при публикување");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(`/api/courses/${courseId}`);

      toast.success("Курсот е успешно избришан");
      router.push(`/teacher/courses`);
      router.refresh();
    } catch {
      toast.error("Грешка при бришење");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onPublish}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Приватно" : "Објави"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default Actions;
