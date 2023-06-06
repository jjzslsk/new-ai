<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import {
	NButton,
	NInput,
	useMessage,
	NUpload,
	NSelect,
	useDialog,
} from "naive-ui";
import type { UploadInst, UploadFileInfo, SelectOption } from "naive-ui";
import { getUserSession } from "@/utils/functions";
import {
	fetchRepositoryList,
	fetchRepositorySave,
	fetchRepositoryDel,
} from "@/api";
const message = useMessage();
const dialog = useDialog();
const formState = reactive({
	user_id: `${getUserSession("user_id")}`, //用户id
	file_id: ``, //文档ID
	repositoryName: "", //知识库名称
	repositoryType: "add", //下拉选择知识库
	repositoryDoc: "", //文档整理
	repositorDescribe: "", //使用说明
});
const uploadParam = reactive({ user_id: "" });
const selectList = ref<any>([{ label: "新增知识库", value: "add" }]);
let fileList = ref<any>([]);
const fileListLength = ref(0);

const uploadRef = ref<UploadInst | null>(null);

function handleChange(options: { fileList: UploadFileInfo[] }): void {
	fileListLength.value = options.fileList.length;
	// alert("加载中...");
}

async function uploadData(): Promise<void> {
	return new Promise((resolve, reject) => {
		(uploadParam.user_id = `${getUserSession("user_id")}`),
			resolve(uploadRef.value?.submit());
	});
}

const handleClick = async () => {
	await uploadData();
};

const handleFinish = ({
	file,
	event,
}: {
	file: UploadFileInfo;
	event?: ProgressEvent;
}) => {
	let res = JSON.parse((event?.target as XMLHttpRequest).response);
	if (res.code == "200") {
		message.success(res.message);
		formState.file_id = res.data.file_id;
		// formState.repositoryDoc = "";
		formState.repositoryDoc = res.data.summary.text;
	} else {
		message.error(res.message);
	}
	return message;
};

async function save() {
	let param = {
		index_name: formState.repositoryName,
		file_id: formState.file_id,
		final_report: formState.repositoryDoc,
		instructions: formState.repositorDescribe,
		user_id: `${getUserSession("user_id")}`,
	};
	const res = await fetchRepositorySave(param);
	console.log(res);
	dialog.success({
		content: "保存成功",
		positiveText: "确定",
		onPositiveClick: () => {
			(formState.file_id = ""),
				(formState.repositoryName = ""),
				(formState.repositoryType = "add"),
				(formState.repositoryDoc = ""),
				(formState.repositorDescribe = ""),
				(selectList.value = [{ label: "新增知识库", value: "add" }]),
				(fileList.value = []);
			getRepositoryList();
		},
	});
}

async function del() {
	if (formState.repositoryType == "" || formState.repositoryType == "add") {
		message.warning("请选择需要删除的知识库");
		return;
	}
	let param = {
		user_id: `${getUserSession("user_id")}`,
		index_name: formState.repositoryType,
	};
	const res = (await fetchRepositoryDel(param)).data;
	console.log(res);
	dialog.success({
		content: "删除成功",
		positiveText: "确定",
		onPositiveClick: () => {
			(formState.file_id = ""),
				(formState.repositoryName = ""),
				(formState.repositoryType = "add"),
				(formState.repositoryDoc = ""),
				(formState.repositorDescribe = ""),
				(selectList.value = [{ label: "新增知识库", value: "add" }]),
				(fileList.value = []);
			getRepositoryList();
		},
	});
}

const handleUpdateValue = (value: string, option: SelectOption) => {
	if (value == "add") {
		formState.repositoryName = "";
		formState.repositoryDoc = "";
		formState.repositorDescribe = "";
	} else {
		formState.repositoryName = option.index_name + "";
		formState.repositoryDoc = option.final_report + "";
		formState.repositorDescribe = option.instructions + "";
	}
};

const getRepositoryList = async () => {
	let param = {
		user_id: `${getUserSession("user_id")}`,
		index_name: "",
	};
	const res = (await fetchRepositoryList(param)).data;
	res.data.map((i: any, idx: any) => {
		i.label = i.index_name;
		i.value = i.index_name;
		selectList.value.push(i);
	});
	formState.repositoryType = selectList.value[0].value;
};
const beforeUpload = (fileList: UploadFileInfo[]) => {
	console.log("上传中...", fileList);
	// alert("1122");
};
onMounted(() => {
	getRepositoryList();
});

const noSideSpace = (value: string) =>
	!value.startsWith(" ") && !value.endsWith(" ");
</script>
<template>
	<div class="p-4 space-y-5 min-h-[480px]">
		<div class="space-y-6">
			<div class="flex items-center space-x-4">
				<span class="flex-shrink-0 w-[100px]">{{
					$t("setting.repositoryType")
				}}</span>
				<div class="w-[200px]">
					<NSelect
						v-model:value="formState.repositoryType"
						@update:value="handleUpdateValue"
						:disabled="formState.repositoryType.length == 0"
						:options="selectList"
					/>
				</div>
			</div>
			<div class="flex items-center space-x-4">
				<span class="flex-shrink-0 w-[100px]">{{
					$t("setting.repositoryName")
				}}</span>
				<div class="w-[200px]">
					<NInput
						v-model:value="formState.repositoryName"
						placeholder=""
						:allow-input="noSideSpace"
					/>
				</div>
			</div>
			<div class="flex items-center space-x-4">
				<span class="flex-shrink-0 w-[100px]">{{
					$t("setting.repositoryUpload")
				}}</span>
				<div class="flex-1">
					<NUpload
						ref="uploadRef"
						v-model:file-list="fileList"
						action="https://llm.code-tool.com/chat/file/upload"
						:default-upload="false"
						:multiple="false"
						@change="handleChange"
						:max="1"
						:data="uploadParam"
						@finish="handleFinish"
						@input="beforeUpload"
					>
						<NButton @click="handleClick">选择文件</NButton>
					</NUpload>
					<NButton
						:disabled="!fileListLength"
						strong
						secondary
						type="success"
						@click="handleClick"
						>上传文件</NButton
					>
				</div>
			</div>
			<div class="flex items-center space-x-4">
				<span class="flex-shrink-0 w-[100px]">{{
					$t("setting.repositoryDoc")
				}}</span>
				<div class="w-[300px]">
					<NInput
						v-model:value="formState.repositoryDoc"
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
					$t("setting.repositorDescribe")
				}}</span>
				<div class="w-[300px]">
					<NInput
						v-model:value="formState.repositorDescribe"
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
