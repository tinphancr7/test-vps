import CustomTextField from "@/components/form/text-field";

import {yupResolver} from "@hookform/resolvers/yup";

import CustomSelect from "@/components/form/custom-select";
import CustomTextarea from "@/components/form/text-area";
import ModalNextUI from "@/components/modal";
import {ruleActions, ruleFields, ruleOrders} from "@/constants";
import {useAppDispatch} from "@/stores";
import {
	createRuleAsync,
	updateRulesetAsync,
} from "@/stores/async-thunks/ruleset-thunk";
import {rulesetSchema} from "@/utils/validation";
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";

interface ModalAddEditRulesetProps {
	isOpen: boolean;

	onOpenChange: (isOpen: boolean) => void;

	idRuleset: string;

	itemData?: any;
}

const ModalAddEditRuleset = ({
	isOpen,
	onOpenChange,
	idRuleset,
	itemData,
	zoneId,
	rulesetId,
	rules,
}: ModalAddEditRulesetProps) => {
	const newRules = rules.map((rule) => ({
		value: rule.id,
		label: rule.description,
	}));
	const dispatch = useAppDispatch();

	const [operators, setOperators] = useState([]);

	const defaultValues = {
		description: itemData?.description || "",
		field: itemData?.field || "",
		operator: itemData?.operator || "",
		value: itemData?.value || "",
		expression: itemData?.expression || "",
		action: itemData?.action || "",
		order: itemData?.order || "",
		pos: itemData?.pos || "",
	};

	const {
		handleSubmit,
		control,
		setValue,
		watch,
		formState: {errors, isSubmitting},
	} = useForm({
		defaultValues,
		mode: "onBlur",

		resolver: yupResolver(rulesetSchema),
	});

	const onSubmit = (data: any) => {
		console.log("data", data);
		let position;

		if (data.order === "first") {
			position = {index: 1};
		} else if (data.order === "custom") {
			position = {after: watch("pos")};
		} else {
			position = {index: rules.length};
		}

		if (idRuleset) {
			dispatch(
				updateRulesetAsync({
					id: idRuleset,
					...data,
				})
			);
		} else {
			dispatch(
				createRuleAsync({
					description: data.description,
					expression: data.expression,
					action: data.action,
					position,
					enabled: false,
					ruleset_id: rulesetId,
					zone_id: zoneId,
				})
			);
		}
	};

	const field = watch("field");
	const operator = watch("operator");
	const value = watch("value");
	const order = watch("order");

	useEffect(() => {
		if (field) {
			const findField = ruleFields.find((item) => item.value === field);
			const operators = findField?.operators || [];
			setOperators(operators);

			// Update operator and expression
			setValue("operator", operators[0]?.value || "");
			setValue("expression", `(${field} ${operators[0]?.value || ""} "")`);
		}
	}, [field, setOperators, setValue]);

	useEffect(() => {
		if (operator) {
			if (operator.includes("not")) {
				const newOperator = operator.replace("not", "");
				setValue("expression", `(not ${field} ${newOperator} "${value}")`);
			} else {
				setValue("expression", `(${field} ${operator} "")`);
			}
		}
	}, [field, operator, setValue]);

	useEffect(() => {
		if (value) {
			if (operator.includes("not")) {
				const newOperator = operator.replace("not", "");
				setValue("expression", `(not ${field} ${newOperator} "${value}")`);
			} else {
				setValue("expression", `(${field} ${operator} "${value}")`);
			}
		} else if (field && operator && !value) {
			if (operator.includes("not")) {
				const newOperator = operator.replace("not", "");
				setValue("expression", `(not ${field} ${newOperator} "${value}")`);
			} else {
				setValue("expression", `(${field} ${operator} "")`);
			}
		}
	}, [field, value, setValue]);

	return (
		<ModalNextUI
			title={idRuleset ? "Update rule" : "Create Rule"}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			onSubmit={handleSubmit(onSubmit)}
			isSubmitting={isSubmitting}
			size="5xl"
			idItem={idRuleset}
		>
			<div className=" grid  grid-cols-12 gap-4 w-full">
				<Controller
					control={control}
					name="description"
					render={({field}) => (
						<div className="col-span-12">
							<CustomTextField
								{...field}
								isRequired
								label="Rule name"
								placeholder=""
								isInvalid={!!errors?.description?.message}
								errorMessage={errors?.description?.message}
							/>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="field"
					render={({field}) => (
						<div className="col-span-3">
							<CustomSelect
								{...field}
								label="Field"
								placeholder="Select ..."
								items={ruleFields}
							/>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="operator"
					render={({field}) => (
						<div className="col-span-3">
							<CustomSelect
								{...field}
								label="Operator"
								placeholder="Select ..."
								isDisabled={operators.length === 0}
								selectedKeys={[field.value]}
								items={operators}
							/>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="value"
					render={({field}) => (
						<div className="col-span-6">
							<CustomTextField
								{...field}
								label="Value"
								classNames={{
									inputWrapper: !watch("operator")
										? "pointer-events-none bg-gray-200"
										: "",
								}}
								isDisabled={!watch("operator")}
								placeholder=""
							/>
						</div>
					)}
				/>

				{/* <div className="flex items-end col-span-2 gap-1">
					<Button radius="sm" color="default">
						Add
					</Button>
					<Button radius="sm" color="default">
						Or
					</Button>
				</div> */}
				<Controller
					control={control}
					name="expression"
					render={({field}) => (
						<div className="col-span-12">
							<CustomTextarea
								{...field}
								label="Expression Preview"
								placeholder=""
								classNames={{
									inputWrapper: "h-20",
								}}
							/>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="action"
					render={({field}) => (
						<div className="col-span-6">
							<CustomSelect
								{...field}
								label="Choose action"
								placeholder="Select ..."
								selectedKeys={[field.value]}
								items={ruleActions}
								isInvalid={!!errors?.action}
								errorMessage={errors?.action?.message}
							/>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="order"
					render={({field}) => (
						<div className="col-span-6">
							<CustomSelect
								{...field}
								label="Select order:"
								placeholder="Select ..."
								items={ruleOrders}
							/>
						</div>
					)}
				/>
				<div className="col-span-6"></div>
				{order === "custom" && (
					<Controller
						control={control}
						name="pos"
						render={({field}) => (
							<div className="col-span-6">
								<CustomSelect
									{...field}
									label="Select which rule this will fire after:"
									placeholder="Select ..."
									items={newRules}
								/>
							</div>
						)}
					/>
				)}
			</div>
		</ModalNextUI>
	);
};

export default ModalAddEditRuleset;
