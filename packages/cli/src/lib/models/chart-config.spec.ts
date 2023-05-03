import { argv } from '../argv';
import { ChartConfig } from './chart-config';


describe('ChartConfig', () => {
  it('should be default chart configuration on argv', () => {
    expect(argv.chart).toStrictEqual(new ChartConfig());
  });

  const fakeCliOptions = {
    perCategoryAndFileType: true,
    perCategoryTotals: false,
    width: 42,
    height: 42,
    bg: 'negro',
    title: 'Grine-DING',
    xAxisLabel: 'tomorrows',
    yAxisLabel: 'weather',
    overwrite: false,
    outFile: 'flibbidy-giblets.png',
  } as ChartConfig;

  const defaultInstance = new ChartConfig();

  // loop over all public keys to set key differently
  Object.keys(fakeCliOptions).forEach((keyToTest) => {

      const instantiatedViaCli = new ChartConfig({ [keyToTest]: fakeCliOptions[keyToTest] } as any);

      it(`should override default '${keyToTest}: ${defaultInstance[keyToTest]}' value with '${keyToTest}: ${instantiatedViaCli[keyToTest]}'`, () => {
        expect(defaultInstance[keyToTest]).not.toEqual(instantiatedViaCli[keyToTest]);
      });

      // loop over all remaining keys after having set one key different
      Object.keys(fakeCliOptions).forEach((otherKey) => {
        if (otherKey === keyToTest) { return; }

        // testing differing keys; values should match
        it(`should be default '${otherKey}: ${defaultInstance[otherKey]}' value with '${otherKey}: ${instantiatedViaCli[otherKey]}'`, () => {
          expect(defaultInstance[otherKey]).toEqual(instantiatedViaCli[otherKey]);
        });
    });
  })

});

