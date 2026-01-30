<template>
  <div class="music">
    <img :src="imgUrl" />
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

watch(data, () => {
  const { metadata: md, position: pos = 0 } = JSON.parse(data.value) as {
    metadata?: Metadata;
    position: number;
  };
  position.value = pos;

  if (md) {
    Object.assign(metadata, md);
    console.log("assigned metadata", metadata);
    console.log(typeof metadata.albumArt);
    const binaryString = atob(metadata.albumArt || "");

    // Step 4: Convert binary string to Uint8Array
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }

    imgUrl.value = metadata.albumArt ? URL.createObjectURL(new Blob([byteArray])) : "";
    console.log("assigned imgurl");
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
    width: 100px;
    height: 100px;
    max-width: 100px;
    max-height: 100px;
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
