import { test } from '@japa/runner'
import RotaryYear from '../../../app/Utils/Classes/RotaryYear'
import assert from 'assert'

test.group('Utils rotary year', () => {
  test('getCurrentYear returns the current year', () => {
    const currentYear = RotaryYear.getCurrentYear()
    assert.equal(currentYear, new Date().getFullYear().toString())
  })

  test('getYears returns an array of years from 2020 to the current year', () => {
    const years = RotaryYear.getYears(new Date().getFullYear())
    assert.equal(years.length, new Date().getFullYear() - 2020 + 1)
    assert.equal(years[0], '2020-2021')
    assert.equal(years[years.length - 1], `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`)
  })
})
