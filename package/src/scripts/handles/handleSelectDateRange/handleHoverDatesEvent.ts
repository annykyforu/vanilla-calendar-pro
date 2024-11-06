import createDateRangeTooltip from '@scripts/creators/createDates/createDateRangeTooltip';
import state from '@scripts/handles/handleSelectDateRange/state';
import { addHoverEffect, removeHoverEffect } from '@scripts/handles/handleSelectDateRange/toggleHoverEffect';
import getDate from '@scripts/utils/getDate';
import type { FormatDateString } from '@src/index';

const handleHoverDatesEvent = (e: MouseEvent) => {
  if (!e.target || !state.self?.private?.selectedDates[0]) return;

  if (!(e.target as HTMLElement).closest('[data-vc="dates"]')) {
    state.lastDateEl = null;
    createDateRangeTooltip(state.self, state.tooltipEl, null);
    removeHoverEffect();
    return;
  }

  const dateEl = (e.target as HTMLElement).closest<HTMLElement>('[data-vc-date]');
  if (!dateEl || state.lastDateEl === dateEl) return;

  state.lastDateEl = dateEl;
  createDateRangeTooltip(state.self, state.tooltipEl, dateEl);
  removeHoverEffect();

  const lastDateString = dateEl.dataset.vcDate as FormatDateString;
  const startDate = getDate(state.self.private.selectedDates[0]);
  const endDate = getDate(lastDateString);

  const firstDateEl = state.self.private.mainElement.querySelector<HTMLElement>(`[data-vc-date="${state.self.private.selectedDates[0]}"]`);
  const lastDateEl = state.self.private.mainElement.querySelector<HTMLElement>(`[data-vc-date="${lastDateString}"]`);

  const [firstDateElCorrect, lastDateElCorrect] = startDate < endDate ? [firstDateEl, lastDateEl] : [lastDateEl, firstDateEl];
  const [start, end] = startDate < endDate ? [startDate, endDate] : [endDate, startDate];

  for (let i = new Date(start); i <= end; i.setDate(i.getDate() + 1)) {
    addHoverEffect(i, firstDateElCorrect, lastDateElCorrect);
  }
};

export default handleHoverDatesEvent;
