import create from '@scripts/create';
import createMonths from '@scripts/creators/createMonths';
import createYears from '@scripts/creators/createYears';
import type VanillaCalendar from '@src/vanilla-calendar';

const typeClick = ['month', 'year'] as const;

const getColumnID = (self: VanillaCalendar, type: (typeof typeClick)[number], id: number) => {
  const columnEls: NodeListOf<HTMLElement> = self.HTMLElement.querySelectorAll('[data-vc="column"]');
  const indexColumn = Array.from(columnEls).findIndex((column) => column.closest(`[data-vc-column="${type}"]`));
  const currentValue = Number((columnEls[indexColumn].querySelector(`[data-vc="${type}"]`) as HTMLElement).getAttribute(`data-vc-${type}`));

  return self.currentType === 'month' && indexColumn >= 0 ? id - indexColumn : self.currentType === 'year' && self.selectedYear !== currentValue ? id - 1 : id;
};

const handleMultipleYearSelection = (self: VanillaCalendar, itemEl: HTMLElement) => {
  const selectedYear = getColumnID(self, 'year', Number(itemEl.dataset.vcYearsYear));
  const isBeforeMinDate = self.selectedMonth < self.dateMin.getMonth() && selectedYear <= self.dateMin.getFullYear();
  const isAfterMaxDate = self.selectedMonth > self.dateMax.getMonth() && selectedYear >= self.dateMax.getFullYear();
  const isBeforeMinYear = selectedYear < self.dateMin.getFullYear();
  const isAfterMaxYear = selectedYear > self.dateMax.getFullYear();

  self.selectedYear =
    isBeforeMinDate || isBeforeMinYear ? self.dateMin.getFullYear() : isAfterMaxDate || isAfterMaxYear ? self.dateMax.getFullYear() : selectedYear;
  self.selectedMonth =
    isBeforeMinDate || isBeforeMinYear ? self.dateMin.getMonth() : isAfterMaxDate || isAfterMaxYear ? self.dateMax.getMonth() : self.selectedMonth;
};

const handleMultipleMonthSelection = (self: VanillaCalendar, itemEl: HTMLElement) => {
  const column = itemEl.closest('[data-vc-column="month"]') as HTMLElement;
  const yearEl = column.querySelector('[data-vc="year"]') as HTMLElement;
  const selectedMonth = getColumnID(self, 'month', Number(itemEl.dataset.vcMonthsMonth));
  const selectedYear = Number(yearEl.dataset.vcYear);

  const isBeforeMinDate = selectedMonth < self.dateMin.getMonth() && selectedYear <= self.dateMin.getFullYear();
  const isAfterMaxDate = selectedMonth > self.dateMax.getMonth() && selectedYear >= self.dateMax.getFullYear();

  self.selectedYear = selectedYear;
  self.selectedMonth = isBeforeMinDate ? self.dateMin.getMonth() : isAfterMaxDate ? self.dateMax.getMonth() : selectedMonth;
};

const handleItemClick = (self: VanillaCalendar, event: MouseEvent, type: (typeof typeClick)[number], itemEl: HTMLElement) => {
  const selectByType = {
    year: () => {
      if (self.type === 'multiple') return handleMultipleYearSelection(self, itemEl);
      self.selectedYear = Number(itemEl.dataset.vcYearsYear);
    },
    month: () => {
      if (self.type === 'multiple') return handleMultipleMonthSelection(self, itemEl);
      self.selectedMonth = Number(itemEl.dataset.vcMonthsMonth);
    },
  };
  selectByType[type]();

  const actionByType = {
    year: () => self.actions.clickYear?.(event, self),
    month: () => self.actions.clickMonth?.(event, self),
  };
  actionByType[type]();

  self.currentType = self.type;
  create(self);
};

const handleClickType = (self: VanillaCalendar, event: MouseEvent, type: (typeof typeClick)[number]) => {
  const target = event.target as HTMLElement;

  const headerEl = target.closest<HTMLElement>(`[data-vc="${type}"]`);
  const createByType = {
    year: () => createYears(self, target),
    month: () => createMonths(self, target),
  };
  if (headerEl && self.currentType !== type) return createByType[type]();

  const itemEl = target.closest<HTMLElement>(`[data-vc-${type}s-${type}]`);
  if (itemEl) return handleItemClick(self, event, type, itemEl);

  const gridEl = target.closest<HTMLElement>('[data-vc="grid"]');
  const columnEl = target.closest<HTMLElement>('[data-vc="column"]');

  if ((self.currentType === type && headerEl) || (self.type === 'multiple' && self.currentType === type && gridEl && !columnEl)) {
    self.currentType = self.type;
    create(self);
  }
};

const handleClickMonthOrYear = (self: VanillaCalendar, event: MouseEvent) => {
  typeClick.forEach((type) => {
    if (!self.settings.selection[type] || !event.target) return;
    handleClickType(self, event, type);
  });
};

export default handleClickMonthOrYear;
