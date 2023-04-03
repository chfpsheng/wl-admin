import request from "@/utils/request";

export function computeHeight(Num) {
  const bodyHeight = document.body.clientHeight;
  const tableHeight = bodyHeight - Num;
  return tableHeight;
}
