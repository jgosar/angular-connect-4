export enum CheckersMoveDirection{
  UP_LEFT,
  UP_RIGHT,
  DOWN_RIGHT,
  DOWN_LEFT
}

export const UP_DIRECTIONS: CheckersMoveDirection[] = [CheckersMoveDirection.UP_LEFT, CheckersMoveDirection.UP_RIGHT];
export const DOWN_DIRECTIONS: CheckersMoveDirection[] = [CheckersMoveDirection.DOWN_LEFT, CheckersMoveDirection.DOWN_RIGHT];
export const ALL_DIRECTIONS: CheckersMoveDirection[] = [CheckersMoveDirection.UP_LEFT, CheckersMoveDirection.UP_RIGHT, CheckersMoveDirection.DOWN_RIGHT, CheckersMoveDirection.DOWN_LEFT];
