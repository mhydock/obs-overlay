<template>
  <div class="mouse">
    <div id="trackball">
      <span id="pointer" :style="{ display: mouse_moving ? 'block' : 'none' }"></span>
    </div>
    <svg ref="mouse_buttons">
      <g transform="scale(4.0, 4.0)">
        <path
          id="left_button"
          vector-effect="non-scaling-stroke"
          :class="{ active: active_mouse.has('left_button') }"
          d="m 1.632458,0.132291 c -0.831,0 -1.500167,0.669167 -1.500167,1.500167 v 36.999809 c 0,0.831 0.669167,1.500166 1.500167,1.500166 h 16.470829 c 0.831,0 1.49965,-0.669166 1.49965,-1.500166 v -6.499862 h -4.497916 c -1.108,0 -1.999878,-0.891878 -1.999878,-1.999878 V 0.132291 Z"
        />
        <rect
          id="middle_button"
          vector-effect="non-scaling-stroke"
          :class="{ active: active_mouse.has('middle_button') }"
          width="12"
          height="31"
          x="14.046873"
          y="0.13241124"
          rx="1.5"
        />
        <path
          id="right_button"
          vector-effect="non-scaling-stroke"
          :class="{ active: active_mouse.has('right_button') }"
          d="m 38.577767,0.132291 c 0.831,0 1.500167,0.669167 1.500167,1.500167 v 36.999809 c 0,0.831 -0.669167,1.500166 -1.500167,1.500166 H 22.106938 c -0.831,0 -1.49965,-0.669166 -1.49965,-1.500166 v -6.499862 h 4.497916 c 1.108,0 1.999878,-0.891878 1.999878,-1.999878 V 0.132291 Z"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, useTemplateRef, watch } from "vue";
import type { Message } from "../datatypes";

const MOVE_TIME_LIMIT = 250;

const { data } = defineProps<{
  data: string | null;
}>();

const buttons: { [key: `btn_${number}`]: string } = {
  btn_1: "left_button",
  btn_2: "right_button",
  btn_3: "middle_button",
};

const active_mouse = reactive(new Set());

const mouse_svg = useTemplateRef("mouse_buttons");

const mouse_time = ref(0);
const mouse_origin = reactive({ x: 0, y: 0 });
const mouse_moving = ref(false);
const mouse_offset = reactive({ x: 0, y: 0 });

const addRemoveMouseSocket = (rawmsg: string | null) => {
  if (!rawmsg) return;

  const msg: Message = JSON.parse(rawmsg);

  if (!["mouse_pressed", "mouse_released"].includes(msg.event_type)) {
    return;
  }

  const fn = msg.event_type == "mouse_pressed" ? "add" : "delete";
  const button: string | undefined = buttons[`btn_${msg.button}`];

  if (button) {
    active_mouse[fn](button);
  }
};

const mouseMoveSocket = (rawmsg: string | null) => {
  if (!rawmsg) return;

  const msg: Message = JSON.parse(rawmsg);

  if (!["mouse_moved", "mouse_dragged"].includes(msg.event_type)) {
    return;
  }

  const now = Date.now();
  if (now - mouse_time.value > MOVE_TIME_LIMIT) {
    mouse_origin.x = msg.x;
    mouse_origin.y = msg.y;
    mouse_moving.value = true;
  }

  mouse_time.value = now;

  if (mouse_moving.value) {
    let x = msg.x - mouse_origin.x;
    let y = msg.y - mouse_origin.y;

    x = Math.max(Math.min((x / 500) * 100, 50), -50);
    y = Math.max(Math.min((y / 500) * 100, 50), -50);

    const mag = Math.hypot(x, y);
    if (mag > 0) {
      const lim_x = (x / mag) * 50;
      const lim_y = (y / mag) * 50;

      x = x < 0 ? Math.max(x, lim_x) : Math.min(x, lim_x);
      y = y < 0 ? Math.max(y, lim_y) : Math.min(y, lim_y);
    }

    mouse_offset.x = x;
    mouse_offset.y = y;
  }
};

onMounted(() => {
  const bbox = mouse_svg.value?.getBBox();
  if (mouse_svg.value && bbox) {
    mouse_svg.value.style.width = bbox.width + 1 + "px";
    mouse_svg.value.style.height = bbox.height + 1 + "px";
  }
});

watch(() => data, addRemoveMouseSocket);
watch(() => data, mouseMoveSocket);

setInterval(() => {
  if (Date.now() - mouse_time.value > MOVE_TIME_LIMIT && mouse_moving.value) {
    mouse_moving.value = false;
  }
}, 20);
</script>

<style lang="scss" scoped>
@use "@/assets/base.css";

.mouse {
  display: flex;

  #trackball {
    border: 1px solid var(--vt-c-white-mute);
    border-radius: 100px;
    background-color: var(--vt-c-text-light-2);
    width: 7rem;
    height: 7rem;
    position: relative;
    margin-right: 2rem;
    margin-top: 5rem;

    #pointer {
      width: 2rem;
      height: 2rem;
      background-color: var(--vt-c-white-mute);
      border-radius: 100px;
      position: absolute;
      top: calc(50% - 1rem + v-bind("mouse_offset.y + '%'"));
      left: calc(50% - 1rem + v-bind("mouse_offset.x + '%'"));
    }
  }
}

svg {
  width: auto;
  height: 100%;

  path,
  rect {
    fill: var(--vt-c-text-light-2);
    stroke: var(--vt-c-white-mute);
    stroke-width: 1px;
    stroke-opacity: 1;
  }

  path.active,
  rect.active {
    fill: var(--vt-c-white-mute);
  }
}
</style>
