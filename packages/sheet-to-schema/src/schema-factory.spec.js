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
    const schema = factory.get()
    expect(schema).toEqual({
      id: [Number],
      city: [String],
      state: [String],
      year: [Number],
      visited: [Boolean],
      resided: [Boolean, 'optional'],
      population: [Number],
      area: [Number],
      latitude: [Number],
      longitude: [Number],
      rating: [Number, 'null'],
    })
    factory.writeFile('schema.js')
  })
})
