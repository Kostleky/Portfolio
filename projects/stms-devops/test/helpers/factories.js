/**
 * Test data factories
 * Generates consistent test data across test suites
 */

/**
 * Generate team test data
 * @param {Object} overrides - Override default values
 * @returns {Object} Team data
 */
export function teamFactory (overrides = {}) {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)

  return {
    name: overrides.name || `Test Team ${timestamp}-${random}`,
    sport: 'Football',
    ...overrides
  }
}

/**
 * Generate coach test data
 * @param {Object} overrides - Override default values
 * @returns {Object} Coach data
 */
export function coachFactory (overrides = {}) {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)

  return {
    firstName: 'John',
    lastName: 'Doe',
    email: overrides.email || `john.doe.${timestamp}-${random}@test.com`,
    phone: '0123456789',
    certifications: ['Diploma 1', 'Diploma 2'],
    ...overrides
  }
}

/**
 * Generate facility test data
 * @param {Object} overrides - Override default values
 * @returns {Object} Facility data
 */
export function facilityFactory (overrides = {}) {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)

  return {
    name: overrides.name || `Test Facility ${timestamp}-${random}`,
    address: '123 Test Street',
    ...overrides
  }
}

/**
 * Generate match session test data
 * @param {Object} overrides - Override default values
 * @returns {Object} Match session data
 */
export function matchSessionFactory (overrides = {}) {
  return {
    eventDate: new Date().toISOString(),
    eventSlot: 'morning',
    opponent: 'Test Opponent',
    type: 'home',
    ...overrides
  }
}

/**
 * Generate training session test data
 * @param {Object} overrides - Override default values
 * @returns {Object} Training session data
 */
export function trainingSessionFactory (overrides = {}) {
  return {
    eventDate: new Date().toISOString(),
    eventSlot: 'morning',
    duration: 90,
    ...overrides
  }
}
