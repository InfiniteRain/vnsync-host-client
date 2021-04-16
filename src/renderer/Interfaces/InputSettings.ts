export interface InputSettings {
  type: "leftMouseClick" | "enterKeyPress";
  isDoubleClick: boolean;
  timeoutBetweenDownAndUp: number;
  timeoutBetweenActivationAndInput: number;
}
