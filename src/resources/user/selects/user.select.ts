export const profileBaseSelect = {
	email: true,
	login: true,
	phone: true,
}

export const userBaseSelect = {
	id: true,
	role: true,
}

export const userRegisterSelect = {
	...userBaseSelect,
	profile: {
		select: profileBaseSelect,
	},
}

export const userLoginSelect = {
	id: true,
	profile: {
		select: {
			...profileBaseSelect,
			password: true,
		},
	},
	role: true,
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
	profile: {
		select: profileBaseSelect,
	},
}
