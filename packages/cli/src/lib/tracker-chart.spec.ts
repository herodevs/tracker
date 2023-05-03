import { argv } from './argv';
import { ChartConfig } from './models/chart-config';
import { TrackerChart } from './tracker-chart';


describe('TrackerChart', () => {

  describe('ctor', () => {
    let chart;
    beforeEach(() => {
      chart = new TrackerChart(argv.chart, [], 'foo')
    });

    it('should have default _config', () => {
      expect((chart as any)._config).toStrictEqual(new ChartConfig());
    });

    it('should have empty _allProcessResults', () => {
      expect((chart as any)._allProcessResults).toStrictEqual([]);
    });

    it('should have foo _dateFormat', () => {
      expect((chart as any)._dateFormat).toStrictEqual('foo');
    });
  });

  describe('private methods', () => {
    let spyChart: TrackerChart;
    let ogGetDataAndLabels;
    let getDataAndLabelsSpy: jest.SpyInstance;
    let getTotalsPerCategorySpy: jest.SpyInstance;
    let getTotalsPerFileTypePerCategorySpy: jest.SpyInstance;
    let generateGraphImageFileSpy: jest.SpyInstance;
    const noop = () => { undefined };
    beforeEach(() => {
      spyChart = new TrackerChart(argv.chart, [1] as any, 'foo');
      ogGetDataAndLabels = (spyChart as any).getDataAndLabels;
      getDataAndLabelsSpy = jest.spyOn((spyChart as any), 'getDataAndLabels').mockImplementation(noop);
      getTotalsPerCategorySpy = jest.spyOn((spyChart as any), 'getTotalsPerCategory').mockImplementation(noop);
      getTotalsPerFileTypePerCategorySpy = jest.spyOn((spyChart as any), 'getTotalsPerFileTypePerCategory').mockImplementation(noop);
      generateGraphImageFileSpy = jest.spyOn((spyChart as any), 'generateGraphImageFile').mockImplementation(noop);

    });

    afterEach(() => {
      getDataAndLabelsSpy.mockReset();
      getTotalsPerCategorySpy.mockReset();
      getTotalsPerFileTypePerCategorySpy.mockReset();
      generateGraphImageFileSpy.mockReset();
    });

    it('calls getDataAndLabels inside writeTo', () => {
      spyChart.writeTo('');
      expect(getDataAndLabelsSpy).toHaveBeenCalledWith([1], 'total');
    });

    it('calls generateGraphImageFileSpy inside writeTo', () => {
      spyChart.writeTo('');
      expect(generateGraphImageFileSpy).toHaveBeenCalledWith('', undefined);
    });

    it('calls getTotalsPerCategory inside getDataLabels', () => {
      (spyChart as any).getDataAndLabels = ogGetDataAndLabels;
      (spyChart as any).getDataAndLabels([1], 'total');
      expect(getTotalsPerCategorySpy).toHaveBeenCalledWith([1], 'total');
      (spyChart as any).getDataAndLabels = getDataAndLabelsSpy;
    });

    it('calls getTotalsPerFileTypePerCategory inside getDataLabels', () => {
      (spyChart as any)._config._perCategoryTotals = false;
      (spyChart as any)._config._perCategoryAndFileType = true;
      (spyChart as any).getDataAndLabels = ogGetDataAndLabels;
      (spyChart as any).getDataAndLabels([1], 'total');
      expect(getTotalsPerFileTypePerCategorySpy).toHaveBeenCalledWith([1], 'total');
      (spyChart as any).getDataAndLabels = getDataAndLabelsSpy;
    });

    it('calls getTotalsPerCategory inside getDataLabels by default', () => {
      (spyChart as any)._config._perCategoryTotals = undefined;
      (spyChart as any)._config._perCategoryAndFileType = undefined;
      (spyChart as any).getDataAndLabels = ogGetDataAndLabels;
      (spyChart as any).getDataAndLabels([1], 'total');
      expect(getTotalsPerCategorySpy).toHaveBeenCalledWith([1], 'total');
      (spyChart as any).getDataAndLabels = getDataAndLabelsSpy;
    });

  });

});
