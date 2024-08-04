const profileBaseSelect = {
	email: true,
	login: true,
	phone: true,
}

const userBaseSelect = {
	id: true,
	profile: {
		select: profileBaseSelect,
	},
	role: true,
}

export const userRegisterSelect = {
	...userBaseSelect,
}

export const userLoginSelect = {
	...userBaseSelect,
	profile: {
		select: {
			...profileBaseSelect,
			password: true,
		},
	},
}

export const userCheckSelect = {
	profile: {
		select: profileBaseSelect,
	},
}

export const userTokensSelect = {
	id: true,
}

export const userFullSelect = {
	...userBaseSelect,
}
