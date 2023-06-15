<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { fetchToolList, fetchToolSave, fetchToolDel } from "@/api";
import {
	NButton,
	NInput,
	useMessage,
	NSelect,
	useDialog,
	SelectOption,
	NInputGroup,
} from "naive-ui";
import { getUserSession } from "@/utils/functions";
const message = useMessage();
const dialog = useDialog();

const formState = reactive({
	toolType: "add", //工具选择
	toolName: "", //工具名称
	toolDescription: "", //描述

	method: "get", //说明
	url: "",
	params: "", //参数
});


const requestOptions = ref<any>([
	{ label: "GET", value: "get" },
	{ label: "POST", value: "post" },
	{ label: "PUT", value: "put" },
	{ label: "DELETE", value: "delete" },
	{ label: "HEAD", value: "head" },
]);

const selectList = ref<any>([{ label: "新增工具", value: "add" }]);

async function save() {
	if (formState.toolName.length == 0) {
		message.warning("请输入名称");
		return;
	}
	if (formState.toolDescription.length == 0) {
		message.warning("请输入工具描述");
		return;
	}
	let param = { 
		name: formState.toolName,
		usage: formState.toolDescription,
		descriptionDisPlay: {
			method: formState.method,
			url: formState.url,
			params: formState.params,
		},
		description: `你是Python执行器\n你要发送HTTP请求并返回数据HTTP协议相关的url是${formState.url}请求方法是${formState.method}参数是${formState.params}请你输出数据`,
		user_id: `${getUserSession("user_id")}`,
	};
	const res = (await fetchToolSave(param)).data;
	if (res.code == 200) {
		dialog.success({
			content: res.message,
			positiveText: "确定",
			onPositiveClick: () => {
				(formState.toolName = ""),
					(formState.toolType = "add"),
					(formState.toolDescription = ""),
					(formState.url = ""),
					(formState.params = ""),
					(selectList.value = [{ label: "新增工具", value: "add" }]),
					getToolList();
			},
		});
	}
}

async function del() {
	if (formState.toolType == "" || formState.toolType == "add") {
		message.warning("请选择需要删除的工具");
		return;
	}
	let param = {
		user_id: `${getUserSession("user_id")}`,
		name: formState.toolType,
	};
	const res = (await fetchToolDel(param)).data;
	if (res.code == 200) {
		dialog.success({
			content: res.success,
			positiveText: "确定",
			onPositiveClick: () => {
				(formState.toolName = ""),
					(formState.toolType = "add"),
					(formState.toolDescription = ""),
					(formState.url = ""),
					(formState.params = ""),
					(selectList.value = [{ label: "新增工具", value: "add" }]),
					getToolList();
			},
		});
	}
}

const handleUpdateValue = (value: string, option: SelectOption) => {
	if (value == "add") {
		formState.toolName = "";
		formState.toolDescription = "";
		formState.url = "";
		formState.params = "";
		formState.method = "get";
	} else {
		formState.toolName = option.name + "";
		formState.toolDescription = option.usage + "";
		formState.method = option.method + "";
		formState.url = option.url + "";
		formState.params = option.params + "";
	}
};

const getToolList = async () => {
	let param = {
		user_id: `${getUserSession("user_id")}`,
	};
	const res = (await fetchToolList(param)).data;
	res.message.map((i: any, idx: any) => {
		i.label = i.name;
		i.value = i.name;
		i.method = i.descriptionDisPlay.method;
		i.params = i.descriptionDisPlay.params;
		i.url = i.descriptionDisPlay.url;
		selectList.value.push(i);
	});
	formState.toolType = selectList.value[0].value;
};

const noSideSpace = (value: string) =>
	!value.startsWith(" ") && !value.endsWith(" ");

onMounted(() => {
	getToolList();
});
</script>

<template>
	<div class="p-4 space-y-5 min-h-[400px]">
		<div class="space-y-6">
			<div class="flex items-center space-x-4">
				<span class="flex-shrink-0 w-[100px]">{{
					$t("setting.toolType")
				}}</span>
				<div class="w-[200px]">
					<NSelect
						v-model:value="formState.toolType"
						@update:value="handleUpdateValue"
						:disabled="formState.toolType.length == 0"
						:options="selectList"
					/>
				</div>
			</div>
			<div class="flex items-center space-x-4">
				<span class="flex-shrink-0 w-[100px]">{{
					$t("setting.toolName")
				}}</span>
				<div class="w-[200px]">
					<NInput
						v-model:value="formState.toolName"
						placeholder=""
						:allow-input="noSideSpace"
					/>
				</div>
			</div>
			<div class="flex items-center space-x-4">
				<span class="flex-shrink-0 w-[100px]">{{
					$t("setting.toolDescription")
				}}</span>
				<div class="w-[300px]">
					<NInput
						v-model:value="formState.toolDescription"
						type="textarea"
						placeholder=""
						size="small"
						:autosize="{
							minRows: 3,
							maxRows: 5,
						}"
						:allow-input="noSideSpace"
					/>
				</div>
			</div>
			<div class="flex items-center space-x-4">
				<span class="flex-shrink-0 w-[100px]">{{
					$t("setting.method")
				}}</span>
				<div class="w-[400px]">
					<NInputGroup>
						<NSelect :style="{ width: '25%' }" v-model:value="formState.method"  :options="requestOptions" />
						<NInput
							:style="{ width: '75%' }"
							v-model:value="formState.url"
							placeholder="https://"
							size="small"
							:allow-input="noSideSpace"
						/>
					</NInputGroup>
				</div>
			</div>
			<div class="flex items-center space-x-4">
				<span class="flex-shrink-0 w-[100px]">{{
					$t("setting.params")
				}}</span>
				<div class="w-[400px]">
					<NInput
						v-model:value="formState.params"
						type="textarea"
						placeholder="{id: '1'}"
						size="small"
						:autosize="{
							minRows: 3,
							maxRows: 5,
						}"
						:allow-input="noSideSpace"
					/>
				</div>
			</div>
			<div class="flex items-center">
				<div class="flex-1 px-40">
					<NButton type="primary" size="medium" @click="save">
						{{ $t("common.save") }}
					</NButton>
					&nbsp;
					<NButton type="tertiary" size="medium" @click="del">
						{{ $t("common.delete") }}
					</NButton>
				</div>
			</div>
		</div>
	</div>
</template>
