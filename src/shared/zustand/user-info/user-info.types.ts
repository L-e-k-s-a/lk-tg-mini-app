export type DocumentType = {
	id: string;
	name: string;
};

export type ContactInformation = {
	kind_contact_information: string;
	type_contact_information: string;
	represent: string;
};

export type PersonnelInfo = {
	guid: string;
	__typename: string;
	full_name: string;
	name: string;
	patronymic: string;
	surname: string;
	date_of_birth: string;
	place_of_birth: string;
	inn: string;
	snils: string;
	sex: string;
	country: string;
	country_name: string;
	document_type_notion: string;
	document_series: string;
	document_number: string;
	document_date_issue: string;
	document_was_issued_by: string;
	document_department_code: string;
	partner_asu: string;
	document_type: DocumentType;
	contact_information: ContactInformation[];
};

export type StudentInfo = {
	basis: string;
	course: number;
	department_name: string;
	eform: string;
	elevel: string;
	nameprof: string;
	namespec: string;
	group: string;
	headman: string;
	recordbook_code: string;
	recordbook_number: string;
	recordbook_guid: string;
	status: string;
	subgroup: string;
};

export type ME = {
	groups: Array<string>;
	data: PersonnelInfo;
	sub: string;
	email: string;
};

export type EmployeeInfo = {
	position_name: string;
} & Record<string, object | string>;
