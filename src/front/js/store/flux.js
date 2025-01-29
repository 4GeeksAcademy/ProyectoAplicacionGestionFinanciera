const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			categories: [],
			types: [],
			roles: [] 
		},
		actions: {
			 getCategories: async () => {
				const response = await fetch (`${process.env.BACKEND_URL}/api/categories`)
				const data = await response.json()
				console.log(data)
				setStore({categories:data})
				},
			getTypes: async () => {
				const response = await fetch(`${process.env.BACKEND_URL}/api/types`)
				const data = await response.json()
				console.log(data)
				setStore({types:data})
			},
			getRoles: async () => {
				const response = await fetch (`${process.env.BACKEND_URL}/api/roles`)
				const data = await response.json()
			console.log(data)	
			setStore({roles:data})
			},

		}
	};
};

export default getState;
