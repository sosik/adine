'use strict'

/**
 * Registry of all services. can be used for management of global services, create
 * hierarchical structure of registries and instantiate new services with dependency
 * injection.
 *
 * @class
 */
class Services {
	constructor(parent) {
		this._services = new Map()
		this._parent = parent
	}

	/**
	 * Registers new service into registry
	 *
	 * @param {string} name name of service under which it will be indentified
	 * @param {object} instance implementation of service, instance of object
	 *
	 * @returns {Services} self (chainable)
	 *
	 * @throws {Error} if service is already registered in current instance of the
	 * Services Registry
	 */
	register(name, instance) {
		if (this._services.has(name)) {
			throw new Error('Service already registered')
		}

		this._services.put(name, instance)

		return this
	}

	/**
	 * Gets already registered service from registry. If there is parent registry
	 * and service is not found in current one function will try to get service
	 * registered with parent registry.
	 *
	 * @param {string} name name of the servicce to get
	 *
	 * @returns {Object} if service is found it is returned otherwise
	 * undefined is returned
	 */
	get(name) {
		if (this._services.has(name)) {
		} else if (this._parent) {
			return this._parent.get(name)
		} else {
			return
		}
	}

	/**
	 * Creates new instance of provided class with dependency injection.
	 *
	 * @param {class} clazz to instantiate
	 *
	 * @returns {Object} new instance of created object
	 *
	 * @throws {Error} in case there was problem creating instance
	 */
	create(clazz) {
		let injectables = clazz.$inject || []
		let constParams = []

		for (let i of injectables) {
			// as fast approach we expect only service names as dependencies

			constParams.push(this.get(i))
		}

		let newClass = new clazz(...constParams)

		return newClass
	}
}

module.exports = Services
