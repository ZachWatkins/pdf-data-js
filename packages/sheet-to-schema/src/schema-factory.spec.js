import { SchemaFactory } from './schema-factory.js'

const mockData = [
  {
    id: 1,
    city: 'College Station',
    state: 'TX',
    year: 2023,
    visited: true,
    resided: true,
    population: 122807,
    area: 49.6,
    latitude: 30.628,
    longitude: -96.334,
    rating: 1.0,
  },
  {
    id: 2,
    city: 'Austin',
    state: 'TX',
    year: 2023,
    visited: true,
    population: 978908,
    area: 322.48,
    latitude: 30.267,
    longitude: -97.743,
    rating: null,
  },
]

describe('SchemaFactory', () => {
  test('creates a schema from workbook data using the default schema adapter', () => {
    const factory = new SchemaFactory({ rows: mockData })
    factory.writeFile('schema.js')
  })
})
