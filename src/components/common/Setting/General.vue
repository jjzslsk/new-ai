<script lang="ts" setup>
import { computed, ref } from "vue";
import { SvgIcon } from "@/components/common";
import { useAppStore, useUserStore } from "@/store";
import type { UserInfo } from "@/store/modules/user/helper";
import { getCurrentDate } from "@/utils/functions";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { t } from "@/locales";
import { onMounted } from "vue";
import { fetchRepositoryList, fetchToolList } from "@/api";
import {
	NButton,
	useMessage,
	NSelect,
	NSpace,
	NCheckbox,
	NCheckboxGroup,
	NInput,
	NPopconfirm,
} from "naive-ui";
import { getUserSession } from "@/utils/functions";
import { useQueryStore } from "@/store";
import type { QueryInfo } from "@/store/modules/query/helper";
const emit = defineEmits(["update:closeModel"]);
const message = useMessage();
const queryStore = useQueryStore();
const cities = ref(["1"]);
const repositoryList = ref<any>([]);
const repositoryType = ref<any>([]);
const toolList = ref<any>([]);
const tools = ref<any>([]);
cities.value = useQueryStore().queryInfo.model.split(",");
async function save() {
	if (
		cities.value.toString().includes("2") &&
		cities.value.toString().includes("3")
	) {
		var title: any = [...repositoryType.value, ...tools.value].toString();
	} else if (
		cities.value.toString().includes("2") &&
		!cities.value.toString().includes("3")
	) {
		var title: any = [...repositoryType.value].toString();
	} else if (
		!cities.value.toString().includes("2") &&
		cities.value.toString().includes("3")
	) {
		var title: any = [...tools.value].toString();
	} else {
		var title: any = "";
	}
	let param = {
		model: cities.value.toString(),
		title: title,
	};
	updateQueryInfo(param);
}

function updateQueryInfo(options: Partial<QueryInfo>) {
	queryStore.updateQueryInfo(options);
	message.success("保存成功");
	emit("update:closeModel");
}

const getToolList = async () => {
	let param = {
		user_id: `${getUserSession("user_id")}`,
	};
	const res = (await fetchToolList(param)).data;
	res.message.map((i: any, idx: any) => {
		i.label = i.name;
		i.value = i.name;
		toolList.value.push(i);
	});
	tools.value.push(toolList.value[0].value);
};

const getRepositoryList = async () => {
	let param = {
		user_id: `${getUserSession("user_id")}`,
	};
	const res = (await fetchRepositoryList(param)).data;
	res.data.map((i: any, idx: any) => {
		i.label = i.index_name;
		i.value = i.index_name;
		repositoryList.value.push(i);
	});
	repositoryType.value.push(repositoryList.value[0].value);
};

onMounted(() => {
	getRepositoryList();
	getToolList();
});

const appStore = useAppStore();
console.log(appStore);
const userStore = useUserStore();

const { isMobile } = useBasicLayout();

const ms = useMessage();

const userInfo = computed(() => userStore.userInfo);

const avatar = ref(userInfo.value.avatar ?? "");

const name = ref(userInfo.value.name ?? "");

function updateUserInfo(options: Partial<UserInfo>) {
	userStore.updateUserInfo(options);
	ms.success(t("common.success"));
}

function handleReset() {
	userStore.resetUserInfo();
	ms.success(t("common.success"));
	window.location.reload();
}

function exportData(): void {
	const date = getCurrentDate();
	const data: string = localStorage.getItem("chatStorage") || "{}";
	const jsonString: string = JSON.stringify(JSON.parse(data), null, 2);
	const blob: Blob = new Blob([jsonString], { type: "application/json" });
	const url: string = URL.createObjectURL(blob);
	const link: HTMLAnchorElement = document.createElement("a");
	link.href = url;
	link.download = `chat-store_${date}.json`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

function importData(event: Event): void {
	const target = event.target as HTMLInputElement;
	if (!target || !target.files) return;

	const file: File = target.files[0];
	if (!file) return;

	const reader: FileReader = new FileReader();
	reader.onload = () => {
		try {
			const data = JSON.parse(reader.result as string);
			localStorage.setItem("chatStorage", JSON.stringify(data));
			ms.success(t("common.success"));
			location.reload();
		} catch (error) {
			ms.error(t("common.invalidFileFormat"));
		}
	};
	reader.readAsText(file);
}

function clearData(): void {
	localStorage.removeItem("chatStorage");
	location.reload();
}

function handleImportButtonClick(): void {
	const fileInput = document.getElementById("fileInput") as HTMLElement;
	if (fileInput) fileInput.click();
}
</script>

<template>
	<div class="p-4 space-y-5 min-h-[200px]">
		<div class="space-y-6">
			<div class="flex items-center space-x-4">
				<span class="flex-shrink-0 w-[100px]">{{
					$t("setting.avatarLink")
				}}</span>
				<div class="flex-1">
					<NInput v-model:value="avatar" placeholder="" />
				</div>
				<NButton
					size="tiny"
					text
					type="primary"
					@click="updateUserInfo({ avatar })"
				>
					{{ $t("common.save") }}
				</NButton>
			</div>
			<div class="flex items-center space-x-4">
				<span class="flex-shrink-0 w-[100px]">{{ $t("setting.name") }}</span>
				<div class="w-[200px]">
					<NInput v-model:value="name" placeholder="" />
				</div>
				<NButton
					size="tiny"
					text
					type="primary"
					@click="updateUserInfo({ name })"
				>
					{{ $t("common.save") }}
				</NButton>
			</div>
			<div
				class="flex items-center space-x-4"
				:class="isMobile && 'items-start'"
			>
				<span class="flex-shrink-0 w-[100px]">{{
					$t("setting.chatHistory")
				}}</span>

				<div class="flex flex-wrap items-center gap-4">
					<NButton size="small" @click="exportData">
						<template #icon>
							<SvgIcon icon="ri:download-2-fill" />
						</template>
						{{ $t("common.export") }}
					</NButton>

					<input
						id="fileInput"
						type="file"
						style="display: none"
						@change="importData"
					/>
					<NButton size="small" @click="handleImportButtonClick">
						<template #icon>
							<SvgIcon icon="ri:upload-2-fill" />
						</template>
						{{ $t("common.import") }}
					</NButton>

					<NPopconfirm placement="bottom" @positive-click="clearData">
						<template #trigger>
							<NButton size="small">
								<template #icon>
									<SvgIcon icon="ri:close-circle-line" />
								</template>
								{{ $t("common.clear") }}
							</NButton>
						</template>
						{{ $t("chat.clearHistoryConfirm") }}
					</NPopconfirm>
				</div>
			</div>
			<div class="space-y-6">
				<div class="flex items-center space-x-4">
					<span class="flex-shrink-0 w-[100px]">{{ $t("setting.model") }}</span>
					<NCheckboxGroup v-model:value="cities">
						<NSpace item-style="display: flex;">
							<NCheckbox value="1" label="默认AI" />
							<NCheckbox value="2" label="知识库" />
							<NCheckbox value="3" label="工具集" />
						</NSpace>
					</NCheckboxGroup>
				</div>
				<div
					class="flex items-center space-x-4"
					v-if="cities.toString().includes('2')"
				>
					<span class="flex-shrink-0 w-[100px]">{{
						$t("setting.repositoryType")
					}}</span>
					<div class="w-[200px]">
						<NSelect
							multiple
							v-model:value="repositoryType"
							:options="repositoryList"
						/>
					</div>
				</div>
				<div
					class="flex items-center space-x-4"
					v-if="cities.toString().includes('3')"
				>
					<span class="flex-shrink-0 w-[100px]">{{ $t("setting.tools") }}</span>
					<div class="w-[200px]">
						<NSelect v-model:value="tools" :options="toolList" multiple />
					</div>
				</div>
				<div class="flex items-center">
					<div class="flex-1 px-40">
						<NButton type="primary" size="medium" @click="save">
							{{ $t("common.save") }}
						</NButton>
					</div>
				</div>
			</div>
			<div class="flex items-center space-x-4" v-if="false">
				<span class="flex-shrink-0 w-[100px]">{{
					$t("setting.resetUserInfo")
				}}</span>
				<NButton size="small" @click="handleReset">
					{{ $t("common.reset") }}
				</NButton>
			</div>
		</div>
	</div>
</template>
