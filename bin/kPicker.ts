const daysInMonth = (date: Date): number => 33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate();

interface IDateParameters {
    d: (date: Date) => string;
    dd: (date: Date) => string;
    ddd: (date: Date) => string;
    dddd: (date: Date) => string;
    M: (date: Date) => string;
    MM: (date: Date) => string;
    MMM: (date: Date) => string;
    MMMM: (date: Date) => string;
    y: (date: Date) => string;
    yy: (date: Date) => string;
    yyyy: (date: Date) => string;
    h: (date: Date) => string;
    hh: (date: Date) => string;
    H: (date: Date) => string;
    HH: (date: Date) => string;
    m: (date: Date) => string;
    mm: (date: Date) => string;
    s: (date: Date) => string;
    ss: (date: Date) => string;
    l: (date: Date) => string;
    L: (date: Date) => string;
    t: (date: Date) => string;
    tt: (date: Date) => string;
    T: (date: Date) => string;
    TT: (date: Date) => string;
}
interface IDateRegexpParameters {
    d: () => INameValueObject;
    dd: () => INameValueObject;
    ddd: () => INameValueObject;
    dddd: () => INameValueObject;
    M: () => INameValueObject;
    MM: () => INameValueObject;
    MMM: () => INameValueObject;
    MMMM: () => INameValueObject;
    y: () => INameValueObject;
    yy: () => INameValueObject;
    yyyy: () => INameValueObject;
    h: () => INameValueObject;
    hh: () => INameValueObject;
    H: () => INameValueObject;
    HH: () => INameValueObject;
    m: () => INameValueObject;
    mm: () => INameValueObject;
    s: () => INameValueObject;
    ss: () => INameValueObject;
    l: () => INameValueObject;
    L: () => INameValueObject;
    t: () => INameValueObject;
    tt: () => INameValueObject;
    T: () => INameValueObject;
    TT: () => INameValueObject;
}
interface INameValueObject {
    name: DateKey;
    value: string;
}
interface IDateObject {
    date: number | undefined;
    month: number | undefined;
    year: number | undefined;
    hours: number | undefined;
    minutes: number | undefined;
    seconds: number | undefined;
    milliseconds: number | undefined;
}

type DateKey = "date" | "dateStr" | "month" | "yearShort" | "year" | "hours" | "Hour" | "Hours" | "minutes" | "seconds" | "milliseconds" | "t";

class DateParser {
    private expression: RegExp = /d{1,4}|M{1,4}|yy(?:yy)?|y|([HhmsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;
    private shortDaysNames: string[];
    private daysName: string[];
    private shortMonthsNames: string[];
    private monthsNames: string[];
    private shortYearCutoff: number;
    private dateParameters: IDateParameters;
    private dateRegexpParameters: IDateRegexpParameters;
    constructor(shortDaysNames: string[], daysName: string[], shortMonthsNames: string[], monthsNames: string[], shortYearCutoff: number = 50) {
        this.shortDaysNames = shortDaysNames;
        this.daysName = daysName;
        this.shortMonthsNames = shortMonthsNames;
        this.monthsNames = monthsNames;
        this.shortYearCutoff = shortYearCutoff;
        this.dateParameters = this.getDateParameters();
        this.dateRegexpParameters = this.getFlagsWithRegexp();
    }
    private addPadding(value: number | string, resultLength: number = 2): string {
        let val: string = value.toString();
        while (val.length < resultLength) {
            val = `0${val}`;
        }
        return val;
    }
    private getDateParameters(): IDateParameters {
        return {
            d:      (date: Date): string => `${date.getDate()}`,
            dd:     (date: Date): string => this.addPadding(date.getDate()),
            ddd:    (date: Date): string => this.shortDaysNames[date.getDay()],
            dddd:   (date: Date): string => this.daysName[date.getDay()],
            M:      (date: Date): string => `${date.getMonth() + 1}`,
            MM:     (date: Date): string => this.addPadding(date.getMonth() + 1),
            MMM:    (date: Date): string => this.shortMonthsNames[date.getMonth()],
            MMMM:   (date: Date): string => this.monthsNames[date.getMonth()],
            y:      (date: Date): string => `${parseInt(date.getFullYear().toString().slice(2))}`,
            yy:     (date: Date): string => date.getFullYear().toString().slice(2),
            yyyy:   (date: Date): string => date.getFullYear().toString(),
            h:      (date: Date): string => `${date.getHours() % 12 || 12}`,
            hh:     (date: Date): string => this.addPadding(date.getHours() % 12 || 12),
            H:      (date: Date): string => `${date.getHours()}`,
            HH:     (date: Date): string => this.addPadding(date.getHours()),
            m:      (date: Date): string => `${date.getMinutes()}`,
            mm:     (date: Date): string => this.addPadding(date.getMinutes()),
            s:      (date: Date): string => `${date.getSeconds()}`,
            ss:     (date: Date): string => this.addPadding(date.getSeconds()),
            l:      (date: Date): string => this.addPadding(date.getMilliseconds(), 3),
            L:      (date: Date): string => {
                let mill: number = date.getMilliseconds();
                return `${mill > 99 ? Math.round(mill / 10) : mill}`;
            },
            t:      (date: Date): string => date.getHours() < 12 ? "a" : "p",
            tt:     (date: Date): string => date.getHours() < 12 ? "am" : "pm",
            T:      (date: Date): string => date.getHours() < 12 ? "A" : "P",
            TT:     (date: Date): string => date.getHours() < 12 ? "AM" : "PM"
        };
    }
    private getFlagsWithRegexp(): IDateRegexpParameters {
        let flagFunc = (name: DateKey, value: string) => {
                return (): INameValueObject => {
                    return { name: name, value: value };
                };
            },
            getRegexpText = function(start: number, end: number, arr: string[]) {
                let res: string = "(",
                    i: number;
                for (i = start; i < end; i++) {
                    res += (i !== (end - 1)) ? arr[i] + "|" : arr[i];
                }
                res += ")";
                return res;
            },
            oneOrTwoDigits = "(\\d{1,2})",
            twoDigits = "(\\d{2})";
        return {
            d:      flagFunc("date", oneOrTwoDigits),
            dd:     flagFunc("date", twoDigits),
            ddd:    flagFunc("dateStr", getRegexpText(0, 7, this.shortDaysNames)),
            dddd:   flagFunc("dateStr", getRegexpText(0, 7, this.daysName)),
            M:      flagFunc("month", oneOrTwoDigits),
            MM:     flagFunc("month", twoDigits),
            MMM:    flagFunc("month", getRegexpText(0, 12, this.shortMonthsNames)),
            MMMM:   flagFunc("month", getRegexpText(0, 12, this.monthsNames)),
            y:      flagFunc("yearShort", oneOrTwoDigits),
            yy:     flagFunc("yearShort", twoDigits),
            yyyy:   flagFunc("year", "(\\d{3,4})"),
            h:      flagFunc("hours", oneOrTwoDigits),
            hh:     flagFunc("hours", twoDigits),
            H:      flagFunc("Hour", oneOrTwoDigits),
            HH:     flagFunc("Hours", twoDigits),
            m:      flagFunc("minutes", oneOrTwoDigits),
            mm:     flagFunc("minutes", twoDigits),
            s:      flagFunc("seconds", oneOrTwoDigits),
            ss:     flagFunc("seconds", twoDigits),
            l:      flagFunc("milliseconds", oneOrTwoDigits),
            L:      flagFunc("milliseconds", twoDigits),
            t:      flagFunc("t", "(a|p)"),
            tt:     flagFunc("t", "(am|pm)"),
            T:      flagFunc("t", "(A|P)"),
            TT:     flagFunc("t", "(AM|PM)")
        };
    }
    private getDateFromParts(values: string[], keys: DateKey[]): Date | undefined {
        let date: IDateObject = {
                date: undefined,
                month: undefined,
                year: undefined,
                hours: 12,
                minutes: 0,
                seconds: 0,
                milliseconds: 0
            },
            aAmRegexp: RegExp = /(a|am)/,
            pPmRegexp: RegExp = /(p|pm)/,
            a: string,
            isNan: boolean,
            H: boolean = false,
            dateNow: Date = new Date(),
            parseElement = (elem: DateKey, index: number) => {
                let currIndex = index + 1,
                    value = values[currIndex],
                    intValue: number | undefined = parseInt(value),
                    tempValue: string;
                isNan = isNaN(intValue);
                switch (elem) {
                    case "month":
                        date.month = (isNan) ? this.searchInString(value, this.shortMonthsNames.concat(this.monthsNames)) : intValue - 1;
                        break;
                    case "year":
                        if (!isNan) {
                            date.year = value.length > 2 ? intValue : 2000 + intValue;
                        }
                        break;
                    case "yearShort":
                        if (!isNan) {
                            var centery = (intValue <= this.shortYearCutoff) ? 2000 : 1900;
                            date.year = centery + intValue;
                        }
                        break;
                    case "Hours":
                        H = true;
                        date.hours = !isNan ? intValue : undefined;
                        break;
                    case "date":
                    case "hours":
                    case "minutes":
                    case "seconds":
                    case "milliseconds":
                        date[elem] = !isNan ? intValue : undefined;
                        break;
                    case "t":
                        if (!H && date.hours !== undefined) {
                            tempValue = value.toLowerCase();
                            if (aAmRegexp.test(tempValue) && date.hours >= 12) {
                                if (date.hours === 12) {
                                    date.hours = 0;
                                } else {
                                    date.hours = date.hours - 12;
                                }
                            } else if (pPmRegexp.test(tempValue) && date.hours < 12) {
                                date.hours = date.hours + 12;
                            }
                        }
                }
            };
        values.forEach(parseElement);
        date.date = (date.date !== undefined) ? date.date : dateNow.getDate();
        date.month = (date.month !== undefined) ? date.month : dateNow.getMonth();
        date.year = date.year || dateNow.getFullYear();
        date.hours = (date.hours !== undefined) ? date.hours : 0;
        date.minutes = date.minutes || 0;
        date.seconds = date.seconds || 0;
        date.milliseconds = date.milliseconds || 0;
        isNan = false;
        for (a in date) {
            if (date[a] === undefined) {
                isNan = true;
                break;
            }
        }
        if (isNan) {
            return undefined;
        } else {
            return new Date(date.year, date.month, date.date, date.hours, date.minutes, date.seconds, date.milliseconds);
        }
    }
    private searchInString(value: string, arr: string[]) {
        var valueLowerCase = value.toLowerCase(),
            i: number,
            len: number = arr.length;
        for (i = 0; i < len; i++) {
            if (arr[i].toLowerCase() === valueLowerCase) {
                return i > 11 ? i - 12 : i;
            }
        }
        return undefined;
    }
    public dateToString(date: Date, dateFormat: string): string | undefined {
        let getNextChar = (charValue: string): string => {
                let parameter: ((date: Date) => string) | undefined = this.dateParameters[charValue];
                return parameter ? parameter(date) : charValue.slice(1, charValue.length - 1);
            };
        return dateFormat.replace(this.expression, getNextChar);
    }
    public stringToDate(dateString: string, dateFormat: string): Date | undefined {
        let dateParts: DateKey[] = [],
            getNextChar = (charValue: string): string => {
                let parameter: (() => INameValueObject) | undefined = this.dateRegexpParameters[charValue],
                    paramValue: INameValueObject;
                if (parameter) {
                    paramValue = parameter();
                    dateParts.push(paramValue.name);
                    return paramValue.value;
                } else {
                    return charValue;
                }
            },
            regexp: RegExp = new RegExp(dateFormat.replace(this.expression, getNextChar)),
            result: string[] | null = regexp.exec(dateString);
        if (result && result.length && result.length - 1 === dateParts.length) {
            return this.getDateFromParts(result, dateParts);
        } else {
            return undefined;
        }
    }
}