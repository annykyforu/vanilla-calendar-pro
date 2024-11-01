import handleClickArrow from '@scripts/handles/handleClick/handleClickArrow';
import handleClickDate from '@scripts/handles/handleClick/handleClickDate';
import handleClickMonthOrYear from '@scripts/handles/handleClick/handleClickMonthOrYear';
import { handleClickWeekDay, handleClickWeekNumber } from '@scripts/handles/handleClick/handleClickWeek';
import type { VanillaCalendarPro } from '@src/index';

const handleClick = (self: VanillaCalendarPro) => {
  const clickEventHandler = (e: MouseEvent) => {
    handleClickArrow(self, e);
    handleClickWeekDay(self, e);
    handleClickWeekNumber(self, e);
    handleClickDate(self, e);
    handleClickMonthOrYear(self, e);
  };

  self.private.mainElement.addEventListener('click', clickEventHandler);
  return () => self.private.mainElement.removeEventListener('click', clickEventHandler);
};

export default handleClick;
