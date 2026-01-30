<template>
  <div class="key_flex">
    <div v-for="(row, i) in keys" :key="i">
      <span
        v-for="(v, k) in row"
        :key="k"
        :class="{ active: active_keys.has(k as KeyIndex) }"
        :title="v"
        >{{ v }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import type { KeyboardType, Message } from "../datatypes";

const { data, keyboard } = defineProps<{
  data: string | null;
  keyboard?: KeyboardType;
}>();

type KeyIndex = `key_${number}`;
type KeyMap = { [key: KeyIndex]: string };

const key_defs: KeyMap[] = [
  {
    key_9: "ESC",
    key_10: "1",
    key_11: "2",
    key_12: "3",
    key_13: "4",
    key_14: "5",
  },
  {
    key_15: "6",
    key_16: "7",
    key_17: "8",
    key_18: "9",
    key_19: "0",
    key_20: "-",
    key_21: "=",
    key_22: "BACKSPACE",
  },
  {
    key_23: "TAB",
    key_24: "Q",
    key_25: "W",
    key_26: "E",
    key_27: "R",
    key_28: "T",
  },
  {
    key_29: "Y",
    key_30: "U",
    key_31: "I",
    key_32: "O",
    key_33: "P",
    key_34: "[",
    key_35: "]",
    key_51: "\\",
  },
  {
    key_66: "CAPS",
    key_38: "A",
    key_39: "S",
    key_40: "D",
    key_41: "F",
    key_42: "G",
  },
  {
    key_43: "H",
    key_44: "J",
    key_45: "K",
    key_46: "L",
    key_47: ";",
    key_48: "'",
    key_36: "ENTER",
  },
  {
    key_50: "SHIFT",
    key_52: "Z",
    key_53: "X",
    key_54: "C",
    key_55: "V",
    key_56: "B",
  },
  {
    key_57: "N",
    key_58: "M",
    key_59: ",",
    key_60: ".",
    key_61: "/",
    key_62: "SHIFT",
  },
  {
    key_37: "CTRL",
    key_64: "ALT",
    key_65: "SPACE",
  },
  {
    key_108: "ALT",
  },
];

const keys: KeyMap[] = key_defs
  .filter((row: KeyMap, i: number) => keyboard === "full" || i % 2 === 0)
  .reduce((accum: KeyMap[], curr: KeyMap, i: number) => {
    if (keyboard === "full" && i % 2 === 1) {
      Object.assign(accum[Math.floor(i / 2)] || {}, curr);
    } else {
      accum.push(curr);
    }
    return accum;
  }, []);

const keyCodes = keys.map((row: KeyMap) => Object.keys(row)).flat();

const active_keys = reactive(new Set<KeyIndex>());

// const addRemove = (event: KeyboardEvent, fn: "add" | "delete") => {
//   event.stopPropagation();
//   if (event.repeat) {
//     return;
//   }

//   const key = event.key.toUpperCase();
//   if (keyVals.includes(key)) {
//     active_keys[fn](key);
//   } else if (key === " ") {
//     active_keys[fn]("SPACE");
//   }

//   if ((event.shiftKey && fn === "add") || (!event.shiftKey && fn === "delete")) {
//     active_keys[fn]("SHIFT");
//   }

//   if ((event.ctrlKey && fn === "add") || (!event.ctrlKey && fn === "delete")) {
//     active_keys[fn]("CTRL");
//   }

//   switch (event.code) {
//     case "Escape":
//       active_keys[fn]("ESC");
//       break;
//     case "Tab":
//       active_keys[fn]("TAB");
//       break;
//     case "CapsLock":
//       active_keys[fn]("CAPS");
//       break;
//   }
// };

const addRemoveKeysSocket = (rawmsg: string | null) => {
  if (!rawmsg) return;

  const msg: Message = JSON.parse(rawmsg);
  // console.log(msg);

  if (!["key_pressed", "key_released"].includes(msg.event_type)) {
    return;
  }

  const fn = msg.event_type === "key_pressed" ? "add" : "delete";

  if (keyCodes.includes(`key_${msg.rawcode}`)) {
    active_keys[fn](`key_${msg.rawcode}`);
  }

  console.log(msg);
};

// addEventListener("keydown", (event) => addRemove(event, "add"));
// addEventListener("keyup", (event) => addRemove(event, "delete"));

watch(() => data, addRemoveKeysSocket);
</script>

<style lang="scss" scoped>
@use "@/assets/base.css";

.key_grid {
  display: grid;
  align-content: flex-end;
  grid-template-columns: auto repeat(5, 3rem);
  gap: 0.25rem;

  span {
    border: 1px solid var(--vt-c-white-mute);
    color: var(--vt-c-white-mute);
    padding: 1rem;
    text-align: center;
    font-weight: bold;
    background-color: var(--vt-c-text-light-2);
  }

  span:last-child {
    grid-column-end: span 5;
  }

  span.active {
    background: var(--vt-c-white-mute);
    color: var(--vt-c-black-mute);
  }
}

.key_flex {
  display: flex;
  flex-direction: column;
  align-content: flex-end;
  align-items: stretch;

  div {
    display: flex;
    flex-direction: row;
    align-content: flex-start;
    justify-items: stretch;
  }

  span {
    border: 1px solid var(--vt-c-white-mute);
    border-radius: 4px;
    color: var(--vt-c-white-mute);
    padding: 1rem;
    text-align: center;
    font-weight: bold;
    background-color: var(--vt-c-text-light-2);
    min-width: 4rem;
    margin-right: 0.25rem;
    margin-bottom: 0.25rem;
  }

  span.active {
    background: var(--vt-c-white-mute);
    color: var(--vt-c-black-mute);
  }

  span[title="TAB"] {
    min-width: 6rem;
  }

  span[title="CAPS"] {
    min-width: 7rem;
  }

  span[title="SHIFT"]:first-child {
    min-width: 8.5rem;
  }

  span[title="CTRL"] {
    min-width: 5.5rem;
  }

  span[title="SPACE"] {
    flex: 1 1 auto;
  }

  span[title="BACKSPACE"],
  span[title="\\"],
  span[title="ENTER"],
  span[title="SHIFT"]:last-child {
    flex: 1 1 auto;
  }
}
</style>
