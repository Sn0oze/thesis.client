import * as m from 'moment';
import {extendMoment} from 'moment-range';

export const moment = extendMoment(m);

export const dateFormat = 'DD-MM-YYYY';
export const hourFormat = 'HH';
export const hourMinuteFormat = 'HH:mm';
export const monthFormat = 'MM-YYYY';
export const timeFrameSeparator = ':';
export const timeFrameFormat = `${dateFormat}${timeFrameSeparator}${hourFormat}`;
