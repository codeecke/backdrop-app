import { motorIdValidator } from "@/validators/motorIdValidator";
import { z } from "zod";
import { TClientCommand } from "./TClientCommand";
import { setPositionList } from "@/store/positionListSlice";

const posiitionListItem = z.object({
  motorId: motorIdValidator,
  name: z.string(),
  position: z.number(),
});

export const POSITION_LIST_COMMAND_KEY = "positionList";

export const positionListCommandValidator = z.object({
  command: z.literal(POSITION_LIST_COMMAND_KEY),
  payload: z.array(posiitionListItem),
});

export type TPosition = z.infer<typeof posiitionListItem>;
export type TPositionListCommand = z.infer<typeof positionListCommandValidator>;

export const positionListCommand: TClientCommand<TPositionListCommand> = {
  execute: ({ dispatch, payload }) => {
    dispatch(setPositionList(payload));
  },
};
