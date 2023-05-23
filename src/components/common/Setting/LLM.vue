<script setup lang="ts">
// import { computed, onMounted, ref } from "vue";
import { ref } from "vue";
// import { NSpin } from "naive-ui";
// import { fetchChatConfig } from "@/api";
// import { useAuthStore } from "@/store";

interface ConfigState {
	timeoutMs?: number;
	reverseProxy?: string;
	apiModel?: string;
	socksProxy?: string;
	httpsProxy?: string;
	usage?: string;
}

// const authStore = useAuthStore();

// const loading = ref(false);

const config = ref<ConfigState>();

// const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI);

const ApiKey = "";

// async function fetchConfig() {
// 	const { data } = await fetchChatConfig<ConfigState>();
// 	config.value = data;
// }

// onMounted(() => {
// 	fetchConfig();
// });
</script>

<template>
	<!-- <NSpin :show="loading"> -->
	<div class="p-4 space-y-4">
		<p>{{ $t("setting.api") }}：{{ ApiKey }}</p>
		<p>{{ $t("setting.randomness") }}：{{ config?.usage ?? "-" }}</p>
	</div>
	<!-- </NSpin> -->
</template>
