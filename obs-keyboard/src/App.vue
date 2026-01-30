<template>
  <div class="root" :style="{ alignItems: params.has('right') ? 'flex-end' : 'flex-start' }">
    <Music v-show="params.has('music')"></Music>
    <div class="gap"></div>
    <Controller v-show="params.has('controller')" :data="data"></Controller>
    <div class="input-overlay" v-show="params.has('keyboard')">
      <Keyboard :data="data" :keyboard="keyboard_style"></Keyboard>
      <Mouse :data="data"></Mouse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useWebSocket } from "@vueuse/core";
import Controller from "./components/ControllerWidget.vue";
import Keyboard from "./components/KeyboardWidget.vue";
import Mouse from "./components/MouseWidget.vue";
import Music from "./components/MusicWidget.vue";
import { KEYBOARD_TYPES, type KeyboardType } from "./datatypes";

const params = computed(() => {
  return new URLSearchParams(window.location.search);
});

const keyboard_style = computed(() => {
  const style = params.value.get("keyboard")?.toLowerCase();
  console.log(style);
  return style && KEYBOARD_TYPES.includes(style as KeyboardType)
    ? (style as KeyboardType)
    : undefined;
});

const { status, data, send, open, close } = useWebSocket("ws://localhost:16899", {
  heartbeat: {
    interval: 1000,
    pongTimeout: 30000,
  },
  autoReconnect: {
    retries: 3,
    delay: 1000,
    onFailed() {
      console.log("Failed to connect WebSocket after 3 retries");
    },
  },
});

onMounted(() => {
  console.log(status);
});
</script>

<style lang="scss" scoped>
.root {
  padding: 1rem;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
}

.gap {
  flex: 1 1 auto;
}

.input-overlay {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
