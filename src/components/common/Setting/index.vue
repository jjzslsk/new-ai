<script setup lang="ts">
import { computed, ref } from "vue";
import { NModal, NTabPane, NTabs } from "naive-ui";
import General from "./General.vue";
import Advanced from "./Advanced.vue";
// import About from "./About.vue";
import LLM from "./LLM.vue";
import Repository from "./Repository.vue";
import ToolKit from "./ToolKit.vue";
import { useAuthStore } from "@/store";
import { SvgIcon } from "@/components/common";

interface Props {
	visible: boolean;
}

interface Emit {
	(e: "update:visible", visible: boolean): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emit>();

const authStore = useAuthStore();

const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI);

const active = ref("General");

const show = computed({
	get() {
		return props.visible;
	},
	set(visible: boolean) {
		emit("update:visible", visible);
	},
});
</script>

<template>
	<NModal
		v-model:show="show"
		:auto-focus="false"
		preset="card"
		style="width: 95%; max-width: 640px"
	>
		<div>
			<NTabs v-model:value="active" type="line" animated>
				<NTabPane name="General" tab="General">
					<template #tab>
						<SvgIcon class="text-lg" icon="ri:file-user-line" />
						<span class="ml-2">{{ $t("setting.general") }}</span>
					</template>
					<div class="min-h-[100px]">
						<General />
					</div>
				</NTabPane>
				<NTabPane v-if="isChatGPTAPI" name="Advanced" tab="Advanced">
					<template #tab>
						<SvgIcon class="text-lg" icon="ri:equalizer-line" />
						<span class="ml-2">{{ $t("setting.advanced") }}</span>
					</template>
					<div class="min-h-[100px]">
						<Advanced />
					</div>
				</NTabPane>
				<!-- <NTabPane name="Config" tab="Config">
					<template #tab>
						<SvgIcon class="text-lg" icon="ri:list-settings-line" />
						<span class="ml-2">{{ $t("setting.config") }}</span>
					</template>
					<About />
				</NTabPane> -->
				// LLM
				<NTabPane name="LLM" tab="LLM">
					<template #tab>
						<SvgIcon class="text-lg" icon="ri:list-settings-line" />
						<span class="ml-2">{{ $t("setting.LLM") }}</span>
					</template>
					<LLM />
				</NTabPane>
				// 知识库
				<NTabPane name="Repository" tab="Repository">
					<template #tab>
						<SvgIcon class="text-lg" icon="ri:list-settings-line" />
						<span class="ml-2">{{ $t("setting.repository") }}</span>
					</template>
					<Repository />
				</NTabPane>
				// 工具集
				<NTabPane name="Toolkit" tab="Toolkit">
					<template #tab>
						<SvgIcon class="text-lg" icon="ri:list-settings-line" />
						<span class="ml-2">{{ $t("setting.toolkit") }}</span>
					</template>
					<ToolKit />
				</NTabPane>
			</NTabs>
		</div>
	</NModal>
</template>
