<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import {
	fetchInterfaceList,
	fetchInterfaceSave,
	fetchInterfaceDel,
} from "@/api";
import {
	NButton,
	NInput,
	useMessage,
	NSelect,
	useDialog,
	SelectOption,
} from "naive-ui";
import { getUserSession } from "@/utils/functions";
const message = useMessage();
const dialog = useDialog();

const formState = reactive({
	openType: "add", //模板选择
	openName: "", //模板名称
	openDescription: "", //模板内容
	openDescribe: "", //接口地址
});

const selectList = ref<any>([{ label: "新增接口", value: "add" }]);

async function save() {
	if (formState.openName.length == 0) {
		message.warning("请输入名称");
		return;
	}
	if (formState.openDescription.length == 0) {
		message.warning("请输入模板内容");
		return;
	}

	let param = {
		title: formState.openName,
		content: formState.openDescription,
		url: formState.openDescribe,
		user_id: `${getUserSession("user_id")}`,
	};
	const res = (await fetchInterfaceSave(param)).data;
	if (res.code == 200) {
		dialog.success({
			content: res.message,
			positiveText: "确定",
			onPositiveClick: () => {
				(formState.openName = ""),
					(formState.openType = "add"),
					(formState.openDescription = ""),
					(selectList.value = [{ label: "新增模板", value: "add" }]),
					getToolList();
			},
		});
		formState.openDescribe = res.data.url;
	}
}

async function del() {
	if (formState.openType == "" || formState.openType == "add") {
		message.warning("请选择需要删除的模板");
		return;
	}
	let param = {
		user_id: `${getUserSession("user_id")}`,
		name: formState.openType,
	};
	const res = (await fetchInterfaceDel(param)).data;
	if (res.code == 200) {
		dialog.success({
			content: res.success,
			positiveText: "确定",
			onPositiveClick: () => {
				(formState.openName = ""),
					(formState.openType = "add"),
					(formState.openDescription = ""),
					(selectList.value = [{ label: "新增模板", value: "add" }]),
					getToolList();
			},
		});
	}
}

const handleUpdateValue = (value: string, option: SelectOption) => {
	if (value == "add") {
		formState.openName = "";
		formState.openDescription = "";
	} else {
		formState.openName = option.name + "";
		formState.openDescription = option.description + "";
	}
};
const getToolList = async () => {
	let param = {
		user_id: `${getUserSession("user_id")}`,
	};
	const res = (await fetchInterfaceList(param)).data;
	res.message.map((i: any, idx: any) => {
		i.label = i.name;
		i.value = i.name;
		selectList.value.push(i);
	});
	formState.openType = selectList.value[0].value;
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
				<span class="flex-shrink-0 w-[100px]">模板选择</span>
				<div class="w-[200px]">
					<NSelect
						v-model:value="formState.openType"
						@update:value="handleUpdateValue"
						:disabled="formState.openType.length == 0"
						:options="selectList"
					/>
				</div>
			</div>
			<div class="flex items-center space-x-4">
				<span class="flex-shrink-0 w-[100px]"> 标题</span>
				<div class="w-[200px]">
					<NInput
						v-model:value="formState.openName"
						placeholder=""
						:allow-input="noSideSpace"
					/>
				</div>
			</div>
			<div class="flex items-center space-x-4">
				<span class="flex-shrink-0 w-[100px]">模板内容</span>
				<div class="w-[300px]">
					<NInput
						v-model:value="formState.openDescription"
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
				<span class="flex-shrink-0 w-[100px]">接口地址</span>
				<div class="w-[300px]">
					<NInput
						v-model:value="formState.openDescribe"
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
