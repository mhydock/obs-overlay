<template>
  <div class="wrapper">
    <div class="shoulder_buttons">
      <div :class="{ active: active_buttons.has('bumper_left') }">L1</div>
      <div :class="{ active: Math.abs(analog_trigger_left) > TRIGGER_CUTOFF }">L2</div>
      <div :class="{ active: active_buttons.has('analog_left_button') }">L3</div>
    </div>
    <svg viewBox="0 0 1191.7234 711.74744">
      <g id="layer1" transform="translate(33.861694,1.546875)">
        <path
          id="base"
          d="M 122.89844,-1.546875 A 8.1306327,8.1306327 0 0 0 115.12891,4.1875 L 93.667969,73.736328 A 4.4276997,4.4276997 0 0 0 93.472656,74.933594 166.52075,336.23375 7.3692155 0 0 -7.8710938,255.9668 166.52075,336.23375 7.3692155 0 0 46.285156,687.87305 166.52075,336.23375 7.3692155 0 0 281.51367,496.15625 166.52075,336.23375 7.3692155 0 0 292.32812,453.3457 h 17.04493 a 90,90 0 0 0 58.17773,21.33399 90,90 0 0 0 58.17969,-21.33399 h 272.53906 a 90,90 0 0 0 58.17774,21.33399 90,90 0 0 0 58.17968,-21.33399 h 17.04493 a 336.23375,166.52075 82.630785 0 0 10.81445,42.81055 336.23375,166.52075 82.630785 0 0 235.22847,191.7168 336.23375,166.52075 82.630785 0 0 54.1563,-431.90625 336.23375,166.52075 82.630785 0 0 -101.3438,-181.033206 4.4276992,4.4276992 0 0 0 -0.1953,-1.197266 L 1008.8711,4.1875 a 8.1306336,8.1306336 0 0 0 -7.7695,-5.734375 H 851.07031 A 8.1306327,8.1306327 0 0 0 843.30078,4.1875 l -8.99805,29.158203 H 289.69727 L 280.69922,4.1875 a 8.1306336,8.1306336 0 0 0 -7.76953,-5.734375 z"
        />
        <circle id="face_buttons_well" cx="926.08569" cy="209.679" r="145" />
        <circle
          id="south"
          cx="927.26709"
          cy="294.67899"
          r="40"
          :class="{ active: active_buttons.has('south') }"
        />
        <circle
          id="north"
          cx="927.26709"
          cy="124.679"
          r="40"
          :class="{ active: active_buttons.has('north') }"
        />
        <circle
          id="east"
          cx="1012.267"
          cy="209.679"
          r="40"
          :class="{ active: active_buttons.has('east') }"
        />
        <circle
          id="west"
          cx="842.26703"
          cy="209.679"
          r="40"
          :class="{ active: active_buttons.has('west') }"
        />
        <circle id="right_analog_well" cx="756.448" cy="384.67899" r="90" />
        <circle id="right_analog_stick" cx="756.448" cy="384.67899" r="65" />
        <circle
          id="right_analog_cap"
          cx="756.448"
          cy="384.67899"
          :transform="`translate(${(analog_stick_right.x * 65) / 1.5}, ${(analog_stick_right.y * 65) / 1.5})`"
          :class="{ active: analog_stick_right_moving }"
          r="65"
        />
        <circle id="left_analog_well" cx="367.55164" cy="384.67899" r="90" />
        <circle id="left_analog_stick" cx="367.55164" cy="384.67899" r="65" />
        <circle
          id="left_analog_cap"
          cx="367.55164"
          cy="384.67899"
          :transform="`translate(${(analog_stick_left.x * 65) / 1.5}, ${(analog_stick_left.y * 65) / 1.5})`"
          :class="{ active: analog_stick_left_moving }"
          r="65"
        />
        <circle id="d-pad_well" cx="197.9137" cy="209.679" r="145" />
        <path
          id="d-pad_down"
          d="m 405.77743,459.19757 -25.8283,38.61407 a 19.762026,19.762026 106.88895 0 0 -3.33585,10.98719 l 0,58.00009 a 6,6 45 0 0 6,6 h 53 a 6,6 135 0 0 6,-6 v -58.00009 a 19.762026,19.762026 73.11105 0 0 -3.33585,-10.98719 l -25.8283,-38.61407 a 4.0132995,4.0132995 0 0 0 -6.6717,0 z"
          transform="matrix(1.0769231,0,0,0.78000855,-242.66985,-132.10905)"
          :class="{ active: active_buttons.has('down') }"
        />
        <path
          id="d-pad_up"
          d="m 405.77742,459.1978 -25.82828,38.61384 a 19.761949,19.761949 106.88901 0 0 -3.33586,10.98719 v 58.00009 a 6,6 45 0 0 6,6 h 53 a 6,6 135 0 0 6,-6 v -58.00009 a 19.761949,19.761949 73.110987 0 0 -3.33586,-10.98719 L 412.44914,459.1978 a 4.0133185,4.0133185 0 0 0 -6.67172,0 z"
          transform="matrix(1.0769231,0,0,-0.78001004,-242.66954,551.46791)"
          :class="{ active: active_buttons.has('up') }"
        />
        <path
          id="d-pad_left"
          d="m 405.77747,459.19674 -25.82838,38.61487 a 19.762317,19.762317 106.88872 0 0 -3.33581,10.98722 l 0,58.00009 a 6,6 45 0 0 6,6 h 53 a 6,6 135 0 0 6,-6 v -58.00009 a 19.762317,19.762317 73.111284 0 0 -3.33581,-10.98722 l -25.82838,-38.61487 a 4.0132284,4.0132284 0 0 0 -6.67162,0 z"
          transform="matrix(0,1.0769231,-0.78000295,0,539.69885,-230.90454)"
          :class="{ active: active_buttons.has('left') }"
        />
        <path
          id="d-pad_right"
          d="m 405.77744,459.19731 -25.82832,38.61432 a 19.762118,19.762118 106.88888 0 0 -3.33584,10.9872 l 0,58.00009 a 6,6 45 0 0 6,6 h 53 a 6,6 135 0 0 6,-6 v -58.00009 a 19.762118,19.762118 73.111123 0 0 -3.33584,-10.9872 l -25.82832,-38.61432 a 4.0132772,4.0132772 0 0 0 -6.67168,0 z"
          transform="matrix(0,1.0769231,0.78000679,0,-143.87305,-230.90454)"
          :class="{ active: active_buttons.has('right') }"
        />
        <circle
          id="menu"
          cx="561.99982"
          cy="379.67899"
          r="35"
          :class="{ active: active_buttons.has('menu') }"
        />
        <rect
          id="select"
          width="40"
          height="70"
          x="322.35599"
          y="53.347"
          rx="24"
          :class="{ active: active_buttons.has('select') }"
        />
        <rect
          id="start"
          width="40"
          height="70"
          x="761.64301"
          y="53.347"
          rx="24"
          :class="{ active: active_buttons.has('start') }"
        />
        <path
          id="trackpad"
          d="m 391.99979,52.257595 h 290 V 276.2576 a 6,6 135 0 1 -6,6 l -278,0 a 6,6 45 0 1 -6,-6 z"
          transform="matrix(1.2413793,0,0,1,-104.62058,-18.911018)"
        />
        />
      </g>
    </svg>
    <div class="shoulder_buttons">
      <div :class="{ active: active_buttons.has('bumper_right') }">R1</div>
      <div :class="{ active: Math.abs(analog_trigger_right) > TRIGGER_CUTOFF }">R2</div>
      <div :class="{ active: active_buttons.has('analog_right_button') }">R3</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from "@/datatypes";
import { computed, onMounted, reactive, ref, useTemplateRef, watch } from "vue";

const { data } = defineProps<{
  data: string | null;
}>();

const controller_svg = useTemplateRef("controller");

const ANALOG_STICK_LEFT_X = 0;
const ANALOG_STICK_LEFT_Y = 1;
const ANALOG_STICK_RIGHT_X = 2;
const ANALOG_STICK_RIGHT_Y = 3;
const ANALOG_TRIGGER_LEFT = 4;
const ANALOG_TRIGGER_RIGHT = 5;

const ANALOG_CUTOFF = 0.1;
const TRIGGER_CUTOFF = 0.15;

const analog_stick_left = ref({ x: 0, y: 0 });
const analog_stick_right = ref({ x: 0, y: 0 });
const analog_trigger_left = ref(0);
const analog_trigger_right = ref(0);

const analog_stick_left_moving = computed(
  () =>
    Math.abs(analog_stick_left.value.x) > ANALOG_CUTOFF ||
    Math.abs(analog_stick_left.value.y) > ANALOG_CUTOFF,
);
const analog_stick_right_moving = computed(
  () =>
    Math.abs(analog_stick_right.value.x) > ANALOG_CUTOFF ||
    Math.abs(analog_stick_right.value.y) > ANALOG_CUTOFF,
);

const button_defs = [
  "south",
  "east",
  "west",
  "north",
  "select",
  "menu",
  "start",
  "analog_left_button",
  "analog_right_button",
  "bumper_left",
  "bumper_right",
  "up",
  "down",
  "left",
  "right",
];

const active_buttons = reactive(new Set());

const addRemoveGamepadSocket = (rawmsg: string | null) => {
  if (!rawmsg) return;

  const msg: Message = JSON.parse(rawmsg);

  if (!["controller_button_up", "controller_button_down"].includes(msg.event_type)) {
    return;
  }

  const fn = msg.event_type === "controller_button_down" ? "add" : "delete";
  const key: string | undefined = button_defs[msg.virtual_code];

  if (key) {
    active_buttons[fn](key);
  }
};

const analogMoveSocket = (rawmsg: string | null) => {
  if (!rawmsg) return;

  const msg: Message = JSON.parse(rawmsg);

  if (
    msg.event_type !== "controller_axis_motion" ||
    ([
      ANALOG_STICK_LEFT_X,
      ANALOG_STICK_LEFT_Y,
      ANALOG_STICK_RIGHT_X,
      ANALOG_STICK_RIGHT_Y,
    ].includes(msg.virtual_code) &&
      Math.abs(msg.virtual_value) < ANALOG_CUTOFF / 2)
  ) {
    return;
  }

  switch (msg.virtual_code) {
    case ANALOG_STICK_LEFT_X:
      analog_stick_left.value.x = msg.virtual_value;
      break;
    case ANALOG_STICK_LEFT_Y:
      analog_stick_left.value.y = msg.virtual_value;
      break;
    case ANALOG_STICK_RIGHT_X:
      analog_stick_right.value.x = msg.virtual_value;
      break;
    case ANALOG_STICK_RIGHT_Y:
      analog_stick_right.value.y = msg.virtual_value;
      break;
    case ANALOG_TRIGGER_LEFT:
      analog_trigger_left.value = msg.virtual_value;
      break;
    case ANALOG_TRIGGER_RIGHT:
      analog_trigger_right.value = msg.virtual_value;
      break;
  }
};

watch(() => data, addRemoveGamepadSocket);
watch(() => data, analogMoveSocket);

onMounted(() => {
  const bbox = controller_svg.value?.getBBox();
  if (controller_svg.value && bbox) {
    controller_svg.value.style.width = bbox.width + 1 + "px";
    controller_svg.value.style.height = bbox.height + 1 + "px";
  }
});
</script>

<style lang="scss" scoped>
.wrapper {
  max-height: 15rem;
  min-height: 15rem;
  width: auto;
  display: flex;
  flex-direction: row;
}

.shoulder_buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.shoulder_buttons div {
  width: 5rem;
  height: auto;
  line-height: 2rem;
  text-align: center;
  margin-bottom: 0.5rem;
  border: 1px solid var(--vt-c-white-mute);
  border-radius: 4px;
  color: var(--vt-c-white-mute);
  background-color: var(--vt-c-text-light-2);

  &.active {
    background-color: var(--vt-c-white-mute);
    color: var(--vt-c-black-mute);
  }
}

svg {
  width: auto;
  height: 100%;

  * {
    fill: none;
    stroke: var(--vt-c-white-mute);
    stroke-width: 1px;
    stroke-opacity: 1;
    vector-effect: non-scaling-stroke;
  }

  path#base {
    fill: var(--vt-c-text-light-2);
  }

  #left_analog_cap,
  #right_analog_cap {
    stroke: none;
    fill: none;
  }

  .active {
    fill: var(--vt-c-white-mute) !important;
  }
}
</style>
