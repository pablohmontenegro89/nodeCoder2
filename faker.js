import {faker} from "@faker-js/faker";

const generarProductoRandom = ()=> {
	return {
		nombre: faker.commerce.product(),
		precio: faker.commerce.price(),
		thumbnail: 'https://github.com/pablohmontenegro89/cursoNodeCoder/commit/d09fd139f67418b71bcaacaeab776592ee59cb6e',
	}
}

export default generarProductoRandom