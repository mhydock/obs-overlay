<template>
  <div class="music">
    <div class="img-wrapper">
      <span>🎜</span>
      <img :src="imgUrl" />
    </div>
    <div class="metadata">
      <div class="meta-text">
        <h1>{{ metadata.title }}</h1>
        <h3>{{ metadata.artist?.join(", ") }}</h3>
        <h4>{{ metadata.album }}</h4>
      </div>
      <progress :max="metadata.length" :value="position"></progress>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWebSocket } from "@vueuse/core";
import { onMounted, reactive, ref, watch } from "vue";

interface Metadata {
  albumArt?: string;
  length?: string | number;
  trackid?: string;
  album?: string;
  artist?: string[];
  title?: string;
}

const metadata = reactive<Metadata>({});
const position = ref<string | number>(0);

const imgUrl = ref("");

const { status, data, send, open, close } = useWebSocket("ws://localhost:3000", {
  heartbeat: {
    interval: 10000,
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

watch(data, () => {
  let parsedData = {};

  try {
    parsedData = JSON.parse(data.value);
    if (typeof parsedData !== "object") {
      return;
    }
  } catch {
    return;
  }

  const { metadata: md, position: pos = 0 } = parsedData as {
    metadata?: Metadata;
    position: number;
  };
  position.value = pos;

  if (md) {
    Object.assign(metadata, md);
    const binaryString = atob(metadata.albumArt || "");

    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }

    imgUrl.value = metadata.albumArt ? URL.createObjectURL(new Blob([byteArray])) : "";
  }
});
</script>

<style lang="scss" scoped>
@use "@/assets/base.css";

.music {
  border: 1px solid var(--vt-c-white-mute);
  border-radius: 4px;
  background-color: var(--vt-c-text-light-2);
  padding: 8px;

  display: flex;
  align-items: center;
  width: auto;

  img {
    border: 1px solid var(--vt-c-white-mute);
    border-radius: 2px;
    min-width: 100px;
    width: auto;
    min-height: 100px;
    max-height: 100px;
    z-index: 1;
  }

  .img-wrapper {
    margin: 0;
    padding: 0;
    position: relative;
    display: flex;

    span {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      font-size: 5rem;
      font-variant-emoji: text;
      line-height: 5rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--vt-c-white-mute);
      padding-right: 0.25rem;
    }
  }

  .metadata {
    height: 100%;
    padding-left: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    max-width: 40rem;
    min-width: 40rem;

    h1 {
      overflow: hidden;
      white-space: nowrap;
      color: var(--vt-c-white-mute);
    }
  }

  progress {
    width: 100%;
    height: 8px;
    appearance: none;

    &::-webkit-progress-bar {
      background-color: var(--vt-c-divider-dark-1);
      border-radius: 2px;
    }

    &::-webkit-progress-value {
      background-color: var(--vt-c-white-mute);
      border-radius: 2px;
    }
  }
}
</style>
