import React from "react";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  Typography,
  Button,
} from "@material-tailwind/react";

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemType,
  itemName,
}) {
  const itemLabel = itemType === "gift" ? "подарок" : "вишлист";

  return (
    <Dialog open={isOpen} handler={onClose} size="sm" className="font-primary">
      <DialogHeader className="font-primary">Удалить {itemLabel}</DialogHeader>
      <Typography className="pl-5 pb-2">
        Вы уверены, что хотите удалить {itemLabel} <strong>«{itemName}»</strong>
        ?
      </Typography>
      <Typography className="text-red-500 pl-5">
        Это действие будет невозможно отменить.
      </Typography>
      <DialogFooter>
        <Button variant="gradient" onClick={onClose} className="font-primary mr-1">
          Отмена
        </Button>
        <Button variant="gradient" color="red" onClick={onConfirm} className="font-primary">
          Удалить
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
