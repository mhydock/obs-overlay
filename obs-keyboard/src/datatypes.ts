export interface Message {
  event_source: string;
  event_type:
    | "key_pressed"
    | "key_typed"
    | "key_released"
    | "mouse_pressed"
    | "mouse_clicked"
    | "mouse_released"
    | "mouse_moved"
    | "mouse_dragged"
    | "controller_button_up"
    | "controller_button_down"
    | "controller_axis_motion";
  keycode: number;
  button: number;
  mask: number;
  rawcode: number;
  virtual_code: number;
  virtual_value: number;
  time: number;
  x: number;
  y: number;
}

export const KEYBOARD_TYPES = ["full", "half", undefined] as const;
export type KeyboardType = (typeof KEYBOARD_TYPES)[number];
